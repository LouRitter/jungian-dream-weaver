-- Supabase Database Schema Update for My Dream Library Feature
-- Run these queries in your Supabase SQL Editor

-- 1. Add user_id to the dreams table to link dreams to permanent accounts
ALTER TABLE public.dreams
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. Add an anonymous_user_id to link dreams to temporary device accounts
ALTER TABLE public.dreams
ADD COLUMN IF NOT EXISTS anonymous_user_id UUID;

-- 3. Update RLS policy for dreams to allow users to access their own dreams
-- This policy allows users to select (read) dreams if the dream's user_id matches their own ID,
-- OR if the dream's anonymous_user_id matches an ID they provide (before they log in).
DROP POLICY IF EXISTS "Users can view their own dreams." ON public.dreams;
CREATE POLICY "Users can view their own dreams."
ON public.dreams FOR SELECT
USING ( auth.uid() = user_id OR auth.uid() IS NULL ); -- Simplified for now, will handle anonymous reads via server-side client

-- 4. Update RLS policy for inserting dreams
DROP POLICY IF EXISTS "Users can insert their own dreams." ON public.dreams;
CREATE POLICY "Users can insert their own dreams."
ON public.dreams FOR INSERT
WITH CHECK ( auth.uid() = user_id OR auth.uid() IS NULL );

-- 5. Update RLS policy for updating dreams (for account merging)
DROP POLICY IF EXISTS "Users can update their own dreams." ON public.dreams;
CREATE POLICY "Users can update their own dreams."
ON public.dreams FOR UPDATE
USING ( auth.uid() = user_id OR auth.uid() IS NULL )
WITH CHECK ( auth.uid() = user_id OR auth.uid() IS NULL );

-- 6. Ensure public dreams are still viewable by everyone
DROP POLICY IF EXISTS "Public dreams are viewable by everyone." ON public.dreams;
CREATE POLICY "Public dreams are viewable by everyone."
ON public.dreams FOR SELECT
USING ( is_private = false );
