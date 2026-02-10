

# Migrate from External Supabase to Lovable Cloud

## Overview
Remove the hardcoded external Supabase connection and set up Lovable Cloud as the backend. This will give you a managed, always-available database and auth system without needing to maintain a separate Supabase project.

## Steps

### 1. Enable Lovable Cloud
- Activate Lovable Cloud for this project, which spins up a new Supabase backend automatically.

### 2. Create Database Schema
Run migrations to recreate the required tables:
- **profiles** table: `id` (UUID, FK to auth.users), `username` (text)
- **scores** table: `id`, `user_id` (FK to auth.users), `score` (integer), `created_at`
- Enable RLS on both tables with appropriate policies
- Create a trigger to auto-create a profile when a user signs up

### 3. Update Supabase Client
- Replace `src/lib/supabase.ts` with the auto-generated Lovable Cloud client from `src/integrations/supabase/client.ts`
- Update all imports across the app (6 files) to use the new client

### 4. Update All Components
Files that import from `src/lib/supabase`:
- `src/pages/Index.tsx`
- `src/components/Leaderboard.tsx`
- `src/components/auth/AuthHandler.tsx`
- `src/components/auth/SignInForm.tsx`
- `src/components/auth/SignUpForm.tsx`

All will be updated to import from the new Lovable Cloud client.

### 5. Clean Up
- Delete the old `src/lib/supabase.ts` file with hardcoded credentials

## Technical Details

### Database Schema (SQL)

```text
-- Profiles table
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text,
  created_at timestamptz default now()
);

-- Scores table  
create table public.scores (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  score integer not null,
  created_at timestamptz default now()
);

-- RLS policies for both tables
-- Trigger to auto-create profile on signup
```

### No Data Migration
Since the external Supabase project appears to be unreachable/paused, there is no existing data to migrate. The new Lovable Cloud backend will start fresh.

