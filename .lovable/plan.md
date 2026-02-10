

## Fix: Leaderboard Not Showing Scores

### Problem
The RLS policies on the `profiles` and `scores` tables are all **RESTRICTIVE** (Permissive: No). PostgreSQL requires at least one **PERMISSIVE** policy to grant access. Without any permissive policies, all queries return empty results — which is why the leaderboard shows nothing.

### Solution
Drop the existing restrictive policies and recreate them as **PERMISSIVE** policies (the default). This applies to both the `profiles` and `scores` tables.

### Technical Details

A single database migration will:

1. Drop all existing restrictive policies on `profiles` and `scores`
2. Recreate them as permissive policies with the same access rules:
   - **profiles**: public SELECT, authenticated INSERT (own), authenticated UPDATE (own)
   - **scores**: public SELECT, authenticated INSERT (own)

```text
-- Drop restrictive policies
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view scores" ON public.scores;
DROP POLICY IF EXISTS "Authenticated users can insert own scores" ON public.scores;

-- Recreate as permissive (default)
CREATE POLICY "Anyone can view profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Anyone can view scores" ON public.scores FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert own scores" ON public.scores FOR INSERT WITH CHECK (auth.uid() = user_id);
```

No frontend code changes are needed.
