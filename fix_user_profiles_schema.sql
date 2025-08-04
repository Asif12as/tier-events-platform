-- Fix user_profiles table schema for Clerk integration
-- Run this in your Supabase SQL Editor

-- First, change the id column type from uuid to text for Clerk compatibility
ALTER TABLE user_profiles ALTER COLUMN id TYPE text;

-- Add missing columns to user_profiles table
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS first_name text,
ADD COLUMN IF NOT EXISTS last_name text,
ADD COLUMN IF NOT EXISTS image_url text;

-- Remove the foreign key constraint to auth.users since we're using Clerk
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_id_fkey;

-- Update RLS policies for Clerk integration
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view events based on tier" ON events;
DROP POLICY IF EXISTS "Anonymous users can view free events" ON events;

-- Create new simplified policies for Clerk
CREATE POLICY "Allow all operations on user_profiles"
  ON user_profiles
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all users to read events"
  ON events
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Remove the trigger that won't work with Clerk
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();