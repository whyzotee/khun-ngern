-- 1. Users Table
-- Stores LINE user information synced from LIFF
create table if not exists public.users (
    line_user_id text primary key,
    display_name text not null,
    picture_url text,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

-- 2. User Accounts Table
-- Stores payment information (Bank or PromptPay) for users
create table if not exists public.user_accounts (
    id uuid primary key default gen_random_uuid(),
    user_id text references public.users(line_user_id) on delete cascade not null,
    name text not null, -- Account holder name
    account_type text not null check (account_type in ('bank', 'promptpay')),
    bank_name text, -- e.g., 'KBANK', 'SCB' (NULL if promptpay)
    account_id text not null, -- Bank account number or PromptPay ID
    is_default boolean default false,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

-- 3. Bills Table
-- Stores the main bill record
create table if not exists public.bills (
    id uuid primary key default gen_random_uuid(),
    creator_id text references public.users(line_user_id) on delete cascade not null,
    title text not null,
    total_amount numeric(12, 2) not null,
    status text not null default 'pending' check (status in ('pending', 'paid', 'cancelled')),
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

-- 4. Bill Items Table
-- Breakdown of items within a bill
create table if not exists public.bill_items (
    id uuid primary key default gen_random_uuid(),
    bill_id uuid references public.bills(id) on delete cascade not null,
    name text not null,
    amount numeric(12, 2) not null,
    created_at timestamptz default now() not null
);

-- 5. Bill Participants Table
-- Tracks who owes money and their payment status
create table if not exists public.bill_participants (
    id uuid primary key default gen_random_uuid(),
    bill_id uuid references public.bills(id) on delete cascade not null,
    user_id text references public.users(line_user_id) on delete set null, -- Optional: might be a guest
    display_name text not null, -- Name to display (from LINE or custom)
    amount_owed numeric(12, 2) not null,
    is_paid boolean default false not null,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

-- Indices for performance
create index if not exists idx_user_accounts_user_id on public.user_accounts(user_id);
create index if not exists idx_bills_creator_id on public.bills(creator_id);
create index if not exists idx_bill_items_bill_id on public.bill_items(bill_id);
create index if not exists idx_bill_participants_bill_id on public.bill_participants(bill_id);
create index if not exists idx_bill_participants_user_id on public.bill_participants(user_id);

-- Updated at trigger function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Apply updated_at triggers
create trigger set_users_updated_at before update on public.users for each row execute function public.handle_updated_at();
create trigger set_user_accounts_updated_at before update on public.user_accounts for each row execute function public.handle_updated_at();
create trigger set_bills_updated_at before update on public.bills for each row execute function public.handle_updated_at();
create trigger set_bill_participants_updated_at before update on public.bill_participants for each row execute function public.handle_updated_at();

-- Enable Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.user_accounts enable row level security;
alter table public.bills enable row level security;
alter table public.bill_items enable row level security;
alter table public.bill_participants enable row level security;

-- Basic RLS Policies (Adjust based on security requirements)
-- Note: Edge Functions using service_role bypass RLS. 
-- These policies are for client-side queries using the anon key.

create policy "Users can view their own profile" on public.users
    for select using (auth.uid()::text = line_user_id);

create policy "Users can view their own accounts" on public.user_accounts
    for select using (auth.uid()::text = user_id);

create policy "Users can manage their own accounts" on public.user_accounts
    for all using (auth.uid()::text = user_id);

create policy "Users can view bills they created" on public.bills
    for select using (auth.uid()::text = creator_id);

create policy "Participants can view bills they are in" on public.bills
    for select using (
        exists (
            select 1 from public.bill_participants 
            where bill_id = public.bills.id and user_id = auth.uid()::text
        )
    );
