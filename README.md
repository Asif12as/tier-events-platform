# Tier-Based Event Showcase Platform

A modern web application built with Next.js, Clerk authentication, and Supabase that demonstrates tier-based access control for exclusive events.

## Features

- **Tier-Based Access Control**: Free, Silver, Gold, and Platinum membership tiers
- **User Authentication**: Secure sign-up/sign-in with Clerk
- **Dynamic Event Filtering**: Events displayed based on user's tier level
- **Real-time Database**: Supabase integration with Row Level Security (RLS)
- **Responsive Design**: Modern UI with Tailwind CSS and shadcn/ui components
- **Automatic Profile Creation**: User profiles created automatically upon signup

## Tech Stack

- **Frontend**: Next.js 13+ (App Router), React, TypeScript
- **Authentication**: Clerk
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS, shadcn/ui
- **Deployment**: Vercel

## Demo Credentials

### User Accounts

1. **Free Tier User**
   - Email: `n15070713@gmail.com`
   - Password: `FreeTier12@`

2. **Silver Tier User**
   - Email: `asifmd0033@gmail.com`
   - Password: `SilverTier12@`

3. **Gold Tier User**
   - Email: `r21301486@gmail.com`
   - Password: `GoldTier12@`

4. **Platinum Tier User**
   - Email: `mda957947@gmail.com`
   - Password: `PLatinum12@`

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account
- Clerk account

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd project
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Setup

1. Create a new Supabase project
2. Run the migration file located in `supabase/migrations/20250802084804_amber_dawn.sql`
3. This will create:
   - `user_profiles` table with tier levels
   - `events` table with sample events
   - Row Level Security policies
   - Automatic user profile creation trigger

### 5. Clerk Setup

1. Create a Clerk application
2. Configure the redirect URLs:
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in: `/`
   - After sign-up: `/`
3. Copy the publishable key and secret key to your `.env.local`

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Demo User Credentials

For testing purposes, you can create accounts with different tier levels. After signing up, use the "Upgrade Tier" button in the header to test different access levels:

### Free Tier User
- **Access**: Community Meetup, Beginner Workshop, Open House Event
- **Sign up**: Create any new account (defaults to Free tier)
- **Events visible**: 3 free events

### Silver Tier User
- **Access**: All Free events + Advanced Training, Silver Member Networking, Professional Development
- **Setup**: Sign up → Click "Upgrade Tier" → Select "Silver"
- **Events visible**: 6 events (3 free + 3 silver)

### Gold Tier User
- **Access**: All Free + Silver events + Executive Masterclass, VIP Product Launch, Gold Circle Summit
- **Setup**: Sign up → Click "Upgrade Tier" → Select "Gold"
- **Events visible**: 9 events (3 free + 3 silver + 3 gold)

### Platinum Tier User
- **Access**: All events including Platinum Gala, CEO Roundtable, Platinum Innovation Lab
- **Setup**: Sign up → Click "Upgrade Tier" → Select "Platinum"
- **Events visible**: 12 events (all tiers)

## Deployment on Vercel

### Option 1: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variables in the Vercel project settings
6. Deploy

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Add environment variables
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
vercel env add CLERK_SECRET_KEY
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# ... add all other environment variables

# Redeploy with environment variables
vercel --prod
```

### Important Deployment Notes

1. **Environment Variables**: Ensure all environment variables are added to Vercel
2. **Clerk Configuration**: Update Clerk dashboard with your Vercel domain URLs
3. **Supabase Configuration**: Add your Vercel domain to Supabase allowed origins
4. **Database**: Your Supabase database should already be set up and accessible

## Project Structure

```
project/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Home page with tier logic
│   ├── layout.tsx         # Root layout
│   ├── sign-in/           # Clerk sign-in pages
│   └── sign-up/           # Clerk sign-up pages
├── components/            # React components
│   ├── header.tsx         # Navigation with tier badge
│   ├── events-grid.tsx    # Event listing with filtering
│   ├── event-card.tsx     # Individual event display
│   ├── tier-upgrade-modal.tsx # Tier upgrade interface
│   └── ui/                # shadcn/ui components
├── lib/                   # Utilities and configurations
│   ├── supabase/          # Supabase client setup
│   ├── types.ts           # TypeScript type definitions
│   └── utils.ts           # Utility functions
├── supabase/
│   └── migrations/        # Database migration files
└── .env.local            # Environment variables (not in repo)
```

## Key Features Implemented

### 1. Tier-Based Access Control
- Users can only view events at or below their tier level
- Implemented using Supabase RLS policies
- Client-side filtering for optimal UX

### 2. User Profile Management
- Automatic profile creation upon signup
- Stores user details from Clerk (email, name, image)
- Tier upgrade functionality

### 3. Event Management
- Sample events for each tier level
- Responsive event cards with tier badges
- Date formatting and image display

### 4. Security
- Row Level Security (RLS) on all database tables
- Authenticated and anonymous access policies
- Secure environment variable handling

## Testing the Application

1. **Anonymous Access**: Visit the site without signing in (shows only free events)
2. **Sign Up**: Create a new account (automatically gets Free tier)
3. **Tier Upgrade**: Use the "Upgrade Tier" button to test different access levels
4. **Event Filtering**: Observe how available events change with tier upgrades
5. **Profile Persistence**: Sign out and back in to verify profile persistence

## Support

For any issues or questions regarding setup or deployment, please refer to the documentation of the respective services:
- [Next.js Documentation](https://nextjs.org/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)