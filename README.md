# JobBoard App

A modern job board application built with Next.js and Supabase.

## User Types & Authentication Flow

### User Types

The application supports two types of users:

1. **Job Seekers** - Regular users who browse and apply to job listings
2. **Employers** - Users who can post and manage job listings

In the current implementation, all registered users have the ability to post jobs. The differentiation between job seekers and employers is primarily based on functionality usage rather than explicit role assignment.

### Registration & Authentication

- **Sign Up**: All users register through the same signup form at `/auth/signup`
- **Email Verification**: Users must verify their email before they can fully access the platform
- **Authentication**: Supabase handles authentication using JWT tokens
- **Session Management**: Session persistence is managed via cookies

## User Flows

### Job Seeker Flow

1. **Sign Up**: Register at `/auth/signup` with email, password, and full name
2. **Verify Email**: Click the link sent to your email to verify your account
3. **Login**: Sign in at `/auth/login`
4. **Browse Jobs**: View all available job listings at `/jobs`
5. **Apply for Jobs**: Click "Apply" on any job listing to be directed to the application method

### Employer Flow

1. **Sign Up**: Register at `/auth/signup` with email, password, and full name
2. **Verify Email**: Click the link sent to your email to verify your account
3. **Login**: Sign in at `/auth/login`
4. **Access Dashboard**: Navigate to `/dashboard` to view your posted jobs
5. **Post a Job**: Create a new job listing at `/dashboard/jobs/new`
6. **Manage Jobs**: Edit or delete your job listings from the dashboard

## Posting a Job

To post a job:

1. **Login** to your account
2. **Navigate to Dashboard** by clicking "Dashboard" in the navbar
3. **Click "Post a New Job"** button
4. **Complete the Form** with the following details:
   - Job Title (required)
   - Company Name (required)
   - Job Description (required)
   - Job Location:
     - City (optional)
     - Country (optional)
     - Remote Option (checkbox)
   - Job Type (Full-time/Part-time/Contract/Internship/Freelance)
   - Salary Range (optional)
   - Application URL (required)
5. **Submit** the form to publish your job listing

All users who post jobs are considered "employers" in the context of that job posting. There is no separate employer registration or validation process in the current implementation.

## Future Enhancements for User Roles

In future updates, the app could implement:

1. **Explicit Role Selection**: Add a user_type field to profiles table
2. **Company Profiles**: Allow employers to create detailed company profiles
3. **Employer Verification**: Implement verification for employer accounts
4. **Role-Based UI**: Show different dashboard features based on user type
5. **Premium Features**: Add paid features for employers like featured job listings

## Role-Based Access Control

The application uses Supabase's Row Level Security (RLS) policies to control access:

- Job listings are publicly viewable by all users
- Job editing/deletion is restricted to the user who created the listing
- User profiles are only editable by the user themselves

## Database Schema

The main database tables include:

1. **profiles** - User profile information
   - Linked to Supabase Auth users via `id` (references auth.users.id)
   - Stores additional user data (full_name, avatar_url, etc.)

2. **jobs** - Job listings
   - `id`: UUID primary key
   - `title`: Job title (text)
   - `company`: Company name (text)
   - `description`: Job description (text)
   - `salary`: Salary information (text, optional)
   - `location`: JSON object with city, country, isRemote
   - `type`: Job type (text)
   - `apply_url`: Application URL (text)
   - `created_at`: Timestamp
   - `updated_at`: Timestamp
   - `user_id`: UUID foreign key to auth.users.id

## Dashboard Features

The dashboard is a unified interface for all users but focuses on job management:

- View all your posted jobs
- Edit or delete existing job listings
- Post new job listings
- Track job listing status

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Supabase (Auth, Database, Storage)
- **Authentication**: Supabase Auth with JWT
- **Deployment**: Vercel

## Getting Started

To run the application locally:

1. Clone the repository
2. Install dependencies with `npm install`
3. Set up Supabase credentials in `.env.local` file
4. Run the development server with `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

Create a `.env.local` file with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Troubleshooting

If you encounter issues:

- Verify your Supabase credentials are correct
- Ensure your email is verified by checking your inbox
- Visit `/debug/auth` to diagnose authentication issues
- Visit `/debug/theme` to fix theme-related problems 