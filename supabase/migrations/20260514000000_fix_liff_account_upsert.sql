delete from public.user_accounts a
using public.user_accounts b
where a.user_id = b.user_id
  and (
    a.updated_at < b.updated_at
    or (a.updated_at = b.updated_at and a.ctid < b.ctid)
  );

alter table public.user_accounts
  add constraint user_accounts_user_id_key unique (user_id);
