# Khun Ngern (ขุนเงิน)

Khun Ngern is a billing management application for LINE, inspired by the "KhunThong" social billing bot. It helps users manage group expenses, billing, and payments directly within the LINE ecosystem.

## Tech Stack

- **Frontend:** React (TypeScript)
- **Styling:** Tailwind CSS + shadcn/ui
- **State Management:** Zustand
- **Routing:** Wouter
- **Deployment:** Netlify
- **Backend:** Supabase Edge Functions
- **LINE Integration:** LINE Front-end Framework (LIFF)

## Core Conventions

- **Mobile First:** The UI must be optimized for the LINE in-app browser (mobile).
- **LIFF Integration:** Use `useLiffStore` for managing LIFF state and user profile.
- **Route Protection:** Use `LineGuard` to ensure users are authenticated via LIFF before accessing protected routes.
- **UI Components:** Use shadcn/ui components for consistency.
- **Backend Communication:** Interact with Supabase Edge Functions for data persistence and business logic.

## Project Structure

- `src/components`: Reusable UI components and guards.
- `src/pages`: Application views/screens.
- `src/store`: Zustand stores for global state.
- `src/lib`: Utility functions and shared logic.
- `supabase/functions`: Supabase Edge Functions for backend logic.
- `.github/workflows`: CI/CD automation for Supabase and Netlify.

## CI/CD Setup

To enable automated deployment, ensure the following secrets are configured in your GitHub repository settings:

### Supabase
- `SUPABASE_ACCESS_TOKEN`: Your Supabase Personal Access Token.
- `SUPABASE_PROJECT_ID`: The reference ID of your Supabase project.

### Netlify
- `NETLIFY_AUTH_TOKEN`: Your Netlify Personal Access Token.
- `NETLIFY_SITE_ID`: Your Netlify Site ID.

### Environment Variables (for Frontend Build)
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_LIFF_ID`

## Recent Updates

### 2026-05-06
- Initialized `GEMINI.md` with project vision and tech stack.
- Installed `@supabase/supabase-js` for backend integration.
- Created `src/lib/supabase.ts` for Supabase client initialization.
- Created `useBillStore` using Zustand to manage multi-step bill creation.
- Implemented `CreateBill` page with a 3-step flow.
- Integrated `CreateBill` into `App.tsx` and linked it from `BillCenter`.
- Added a splash screen auto-redirect in `IndexPage`.
- Improved navigation consistency by using `wouter`'s `setLocation`.
- **Backend Implementation:**
  - Created Supabase Edge Functions directory structure.
  - Implemented `create-bill` Edge Function to handle bill and item persistence.
  - Implemented `sync-user` Edge Function to synchronize LIFF profile data with the database.
  - Added shared CORS utility for Edge Functions.
- **CI/CD Automation:**
  - Created `supabase-deploy.yml` for automated Edge Function deployment.
  - Created `netlify-deploy.yml` for automated frontend build and deployment (using Bun).
