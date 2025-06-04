# Supabase Database Configuration

This directory contains database schema and migration files for the Supabase backend.

## Schema

The application uses the following tables:

### Jobs Table
Stores all job listings with their details.

### Profiles Table
Stores user profile information.

## Row Level Security (RLS)

Security policies are configured to ensure:
- Job listings are publicly viewable by everyone
- Only authenticated users can create jobs
- Users can only edit/delete their own jobs

## Functions & Triggers

- `handle_new_user()`: Automatically creates a profile entry when a user signs up

## Storage

- `job_images` bucket: For storing company logos and other job-related images

## How to Use

### Initial Setup

1. Create a Supabase project
2. Copy your Supabase URL and anon key to `.env.local`
3. Run the schema.sql file in the Supabase SQL editor

### Local Development with Supabase CLI (Optional)

If you want to use Supabase CLI for local development:

1. Install Supabase CLI
2. Run `supabase init`
3. Run `supabase start`
4. Link to your remote project with `supabase link`

## Database Diagram

```
┌─────────────┐     ┌──────────────┐
│   profiles  │     │     jobs     │
├─────────────┤     ├──────────────┤
│ id          │     │ id           │
│ email       │     │ title        │
│ full_name   │     │ company      │
│ avatar_url  │     │ description  │
│ created_at  │     │ salary       │
│ updated_at  │     │ location     │
└─────────────┘     │ type         │
      ▲             │ apply_url    │
      │             │ created_at   │
      │             │ updated_at   │
      └─────────────┤ user_id      │
                    └──────────────┘
``` 