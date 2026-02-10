-- Drop FK to auth.users and add FK to profiles instead
ALTER TABLE public.scores DROP CONSTRAINT scores_user_id_fkey;
ALTER TABLE public.scores ADD CONSTRAINT scores_user_id_profiles_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id);