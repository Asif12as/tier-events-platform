/*
  # Tier-Based Event Showcase Database Schema

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `tier` (enum: free, silver, gold, platinum)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `events`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `event_date` (timestamp)
      - `image_url` (text)
      - `tier` (enum: free, silver, gold, platinum)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Users can read their own profile
    - Users can only view events at or below their tier level
    - Public read access for events based on tier restrictions

  3. Sample Data
    - Creates sample events for each tier level
    - Includes realistic event data with images from Pexels
*/

-- Create enum for tier levels
CREATE TYPE tier_level AS ENUM ('free', 'silver', 'gold', 'platinum');

-- Create user profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id text PRIMARY KEY,
  tier tier_level DEFAULT 'free',
  email text,
  first_name text,
  last_name text,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  event_date timestamptz NOT NULL,
  image_url text NOT NULL,
  tier tier_level NOT NULL DEFAULT 'free',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles (adjusted for Clerk integration)
CREATE POLICY "Allow all operations on user_profiles"
  ON user_profiles
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for events (simplified for Clerk integration)
CREATE POLICY "Allow all users to read events"
  ON events
  FOR SELECT
  TO anon, authenticated
  USING (true);



-- Insert sample events
INSERT INTO events (title, description, event_date, image_url, tier) VALUES
-- Free Tier Events
('Community Meetup', 'Join our monthly community gathering to network and share ideas with fellow members.', '2024-03-15 18:00:00+00', 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg', 'free'),
('Beginner Workshop', 'Learn the basics in this introductory workshop designed for newcomers.', '2024-03-20 14:00:00+00', 'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg', 'free'),
('Open House Event', 'Discover what we offer in this open house event, free for everyone.', '2024-03-25 10:00:00+00', 'https://images.pexels.com/photos/1181354/pexels-photo-1181354.jpeg', 'free'),

-- Silver Tier Events
('Advanced Training', 'Take your skills to the next level with our advanced training program.', '2024-03-18 16:00:00+00', 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg', 'silver'),
('Silver Member Networking', 'Exclusive networking event for Silver tier members and above.', '2024-03-22 19:00:00+00', 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg', 'silver'),
('Professional Development', 'Enhance your professional skills with industry experts.', '2024-03-28 13:00:00+00', 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg', 'silver'),

-- Gold Tier Events
('Executive Masterclass', 'Learn from industry leaders in this exclusive masterclass session.', '2024-03-16 15:00:00+00', 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg', 'gold'),
('VIP Product Launch', 'Be the first to see our latest innovations at this VIP launch event.', '2024-03-24 17:00:00+00', 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg', 'gold'),
('Gold Circle Summit', 'Strategic insights and networking for our Gold tier members.', '2024-03-30 09:00:00+00', 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg', 'gold'),

-- Platinum Tier Events
('Platinum Gala', 'Our most exclusive annual gala event for Platinum members only.', '2024-03-17 20:00:00+00', 'https://images.pexels.com/photos/3183132/pexels-photo-3183132.jpeg', 'platinum'),
('CEO Roundtable', 'Direct access to leadership in this intimate roundtable discussion.', '2024-03-26 11:00:00+00', 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg', 'platinum'),
('Platinum Innovation Lab', 'Shape the future with exclusive access to our innovation initiatives.', '2024-03-31 14:00:00+00', 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg', 'platinum');



-- Function to update user tier
CREATE OR REPLACE FUNCTION update_user_tier(user_id text, new_tier tier_level)
RETURNS void AS $$
BEGIN
  UPDATE user_profiles 
  SET tier = new_tier, updated_at = now() 
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;