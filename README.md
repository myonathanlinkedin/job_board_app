# Job Board Application

A modern job board application built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

- 🔍 Browse and search jobs
- 📝 Post, edit, and delete job listings
- 👥 User authentication
- 💼 Company profiles
- 📱 Responsive design

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

## Architecture Overview

This application follows **Domain-Driven Design (DDD)** principles to create a maintainable and scalable codebase. The architecture is organized into the following layers:

1. **Domain Layer**:
   - Contains the core business logic and rules
   - Defines entities (like Job) and value objects (like JobType)
   - Technology-agnostic and has no dependencies on external frameworks
   - Currently implemented only for the Job domain

2. **Application Layer**:
   - Contains use cases that orchestrate the flow of data to and from the domain entities
   - Maps between domain objects and DTOs (Data Transfer Objects)
   - Implements validation and business rules

3. **Infrastructure Layer**:
   - Contains implementations of repositories and services
   - Connects to external systems like Supabase
   - Handles data persistence and external integrations

4. **UI Layer** (Next.js App Router):
   - Presents data to users and captures user inputs
   - Routes to different pages and components
   - Implements responsive design and accessibility features

**Note on Authentication:** This application uses Supabase Auth directly through the `lib/auth.ts` and `lib/auth-client.ts` utilities, rather than implementing a domain layer for user authentication. This approach was chosen for simplicity and to leverage Supabase's built-in authentication features.

## Complete Project Structure

The project follows a Domain-Driven Design (DDD) approach with a clear separation of concerns:

```
/
├── app/                          # Next.js App Router (UI Entry)
│   ├── (auth)/                   # Grouped auth routes (for organization)
│   │   ├── callback/             # Supabase auth callback handler
│   │   │   └── route.ts
│   │   ├── login/                # Login page
│   │   │   └── page.tsx
│   │   └── signup/               # Signup page
│   │       └── page.tsx
│   ├── auth/                     # Public auth routes
│   │   ├── callback/             # Auth callback handlers
│   │   │   └── route.ts
│   │   ├── dashboard-redirect/   # Auth success redirector
│   │   │   └── page.tsx
│   │   ├── login/                # Login page
│   │   │   └── page.tsx
│   │   └── signup/               # Signup page
│   │       └── page.tsx
│   ├── dashboard/                # Protected user dashboard
│   │   ├── jobs/                 # Job management routes
│   │   │   ├── [id]/             # Dynamic job editing routes
│   │   │   │   └── edit/
│   │   │   │       └── page.tsx
│   │   │   └── new/              # New job creation
│   │   │       └── page.tsx
│   │   ├── layout.tsx            # Dashboard layout wrapper
│   │   └── page.tsx              # Main dashboard page
│   ├── debug/                    # Debug utilities
│   │   ├── auth-status/          # Authentication debugger
│   │   │   └── page.tsx
│   │   └── theme/                # Theme debugger
│   │       └── page.tsx
│   ├── employers/                # Employer information
│   │   └── page.tsx
│   ├── jobs/                     # Public job listings
│   │   ├── [id]/                 # Individual job display
│   │   │   └── page.tsx
│   │   ├── JobsListing.tsx       # Jobs list component
│   │   └── page.tsx              # Main jobs page
│   ├── favicon.ico               # Site favicon
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout with providers
│   └── page.tsx                  # Homepage
│
├── components/                   # Reusable UI components
│   ├── forms/                    # Form-related components
│   │   ├── JobForm.tsx           # Job creation/editing form
│   │   └── SearchForm.tsx        # Jobs search form
│   └── ui/                       # UI components
│       ├── Button.tsx            # Button component
│       ├── FilterPanel.tsx       # Filter controls
│       ├── Icons.tsx             # SVG icon components
│       ├── JobCard.tsx           # Job listing card
│       ├── Navbar.tsx            # Site navigation bar
│       ├── ThemeProvider.tsx     # Dark/light theme provider
│       ├── ThemeToggle.tsx       # Theme switcher
│       └── __tests__/            # Component tests
│           ├── JobCard.test.tsx
│           └── ThemeProvider.test.tsx
│
├── domains/                      # Domain-Driven Design core
│   └── job/                      # Job domain
│       ├── application/          # Application layer
│       │   ├── dtos.ts           # Data transfer objects
│       │   └── use-cases/        # Business operations
│       │       ├── create-job.ts
│       │       ├── delete-job.ts
│       │       ├── get-job-by-id.ts
│       │       └── search-jobs.ts
│       ├── domain/               # Domain layer (core)
│       │   ├── entities.ts       # Job entity definition
│       │   ├── value-objects.ts  # Value objects (JobType, etc.)
│       │   └── __tests__/        # Domain tests
│       │       ├── entities.test.ts
│       │       └── value-objects.test.ts
│       └── infrastructure/       # External integrations
│           ├── job-repository.ts # Repository interface
│           └── supabase/         # Supabase implementation
│               └── job-repository-impl.ts
│
├── lib/                          # Shared utilities
│   ├── auth-client.ts            # Client-side auth helpers
│   ├── auth.ts                   # Server-side auth utilities
│   ├── constants.ts              # App constants
│   ├── supabase.ts               # Supabase client
│   └── utils.ts                  # General utilities
│
├── middleware.ts                 # Next.js middleware (auth)
│
├── public/                       # Static assets
│   ├── logo.svg                  # Site logo
│   └── images/                   # Image assets
│
├── styles/                       # Additional styles
│   └── globals.css               # Global styles
│
├── .github/                      # GitHub configuration
│   └── workflows/                # GitHub Actions workflows
│       └── build.yml             # CI build workflow
│
├── .env.local                    # Environment variables
├── .eslintrc.json                # ESLint configuration
├── .gitignore                    # Git ignore rules
├── jest.config.js                # Jest test configuration
├── jest.setup.js                 # Jest setup file
├── next.config.js                # Next.js configuration
├── package.json                  # Dependencies and scripts
├── postcss.config.js             # PostCSS configuration
├── README.md                     # This documentation
├── tailwind.config.js            # Tailwind configuration
└── tsconfig.json                 # TypeScript configuration
```

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

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Supabase (Auth, Database, Storage)
- **Authentication**: Supabase Auth with JWT
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository
2. Install dependencies:

```
npm install
```

3. Create a `.env.local` file in the root directory with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:

```
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Troubleshooting

If you encounter issues:

- Verify your Supabase credentials are correct
- Ensure your email is verified by checking your inbox
- Visit `/debug/auth-status` to diagnose authentication issues
- Visit `/debug/theme` to fix theme-related problems

## Database Schema

The application uses the following Supabase tables:

### Jobs Table
```sql
create table jobs (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  company text not null,
  description text not null,
  salary text,
  location jsonb not null,
  type text not null,
  apply_url text not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  user_id uuid references auth.users(id) on delete cascade not null
);
```

### Profiles Table
```sql
create table profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);
```

## ⚙️ What would you improve if given more time?

With additional time, I would enhance this application in the following ways:

1. **Advanced Search Functionality**:
   - Implement full-text search for job descriptions
   - Add salary range filters
   - Add date-based filters (jobs posted in last 24 hours, week, etc.)

2. **User Features**:
   - Allow job seekers to save/favorite jobs
   - Implement job application tracking
   - Create user profiles with resume upload

3. **Company Features**:
   - Detailed company profiles with logo, description, and social links
   - Analytics dashboard for job listing views and applications

4. **Technical Improvements**:
   - Implement comprehensive unit and integration tests
   - Add server-side caching for improved performance
   - Create a CI/CD pipeline for automated testing and deployment
   - Implement real-time notifications using Supabase realtime subscriptions

5. **UI/UX Enhancements**:
   - Add more animations and transitions for a smoother user experience
   - Implement a more robust component library with consistent design system
   - Add skeleton loaders for improved perceived performance

6. **Accessibility**:
   - Conduct thorough accessibility auditing and improvements
   - Implement keyboard navigation throughout the application
   - Enhance screen reader compatibility

## License

### 📜 License - Apache License 2.0 (TL;DR)

This project follows the **Apache License 2.0**, which means:

- ✅ **You can** use, modify, and distribute the code freely.  
- ✅ **You must** include the original license when distributing.  
- ✅ **You must** include the `NOTICE` file if one is provided.  
- ✅ **You can** use this in personal & commercial projects.  
- ✅ **No warranties** – use at your own risk! 🚀  

For full details, check the [Apache License 2.0](http://www.apache.org/licenses/LICENSE-2.0). 