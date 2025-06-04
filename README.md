# Job Board Application

A modern job board application built with Next.js, Supabase, and Tailwind CSS. This application allows employers to post job listings and job seekers to browse and apply for positions.

## Detailed Project Structure

```
job_board_app/
├── app/                                # Next.js 13+ App Router
│   ├── auth/                           # Authentication routes
│   │   ├── callback/
│   │   │   └── route.ts                # Auth callback handler for login/reset
│   │   ├── dashboard-redirect/
│   │   │   └── page.tsx                # Auth success redirector
│   │   ├── login/
│   │   │   └── page.tsx                # Login page with password reset
│   │   ├── reset-password/
│   │   │   └── page.tsx                # Password reset page
│   │   └── signup/
│   │       └── page.tsx                # Signup page
│   ├── dashboard/                      # User dashboard
│   │   ├── jobs/                       # Job management
│   │   │   ├── new/
│   │   │   │   └── page.tsx            # Create new job form
│   │   │   ├── [id]/
│   │   │   │   └── edit/
│   │   │   │       └── page.tsx        # Edit existing job
│   │   │   └── layout.tsx              # Jobs layout wrapper
│   │   ├── DashboardJobsTable.tsx      # Jobs table component
│   │   ├── layout.tsx                  # Dashboard layout wrapper
│   │   └── page.tsx                    # Main dashboard page
│   ├── debug/                          # Debug utilities
│   │   ├── auth/
│   │   │   └── page.tsx                # Auth debugger
│   │   ├── auth-status/
│   │   │   └── page.tsx                # Session status debugger
│   │   └── theme/
│   │       └── page.tsx                # Theme debugger
│   ├── employers/                      # Employer pages
│   │   └── page.tsx                    # Employers info page
│   ├── jobs/                           # Job listing pages
│   │   ├── [id]/                       # Individual job display
│   │   │   ├── layout.tsx              # Job detail layout
│   │   │   └── page.tsx                # Job detail page
│   │   ├── JobsListing.tsx             # Jobs list component
│   │   └── page.tsx                    # Main jobs listing page
│   ├── layout.tsx                      # Root app layout with ThemeProvider
│   └── page.tsx                        # Homepage
├── components/                         # React components
│   ├── dashboard/
│   │   └── JobList.tsx                 # Dashboard job listing component
│   ├── forms/
│   │   ├── AuthForm.tsx                # Authentication form
│   │   └── JobForm.tsx                 # Job creation/editing form
│   └── ui/                             # UI components
│       ├── __tests__/                  # Component tests
│       │   ├── JobCard.test.tsx        # Tests for JobCard
│       │   └── ThemeProvider.test.tsx  # Tests for ThemeProvider
│       ├── Icons.tsx                   # SVG icon components
│       ├── JobCard.tsx                 # Job card component
│       ├── Navbar.tsx                  # Navigation bar
│       ├── ThemeProvider.tsx           # Theme context provider
│       ├── ThemeToggle.tsx             # Dark/light mode toggle
│       └── Toast.tsx                   # Toast notifications component
├── lib/                                # Utility functions
│   ├── auth-client.ts                  # Client-side auth utilities
│   ├── auth.ts                         # Server-side auth utilities
│   └── supabase.ts                     # Supabase client
├── public/                             # Static assets
│   └── logo.svg                        # Site logo
├── styles/                             # Additional styles
│   └── globals.css                     # Global styles
├── middleware.ts                       # Next.js auth middleware
├── next.config.js                      # Next.js configuration
├── package.json                        # Project dependencies
├── postcss.config.js                   # PostCSS configuration
├── tailwind.config.js                  # Tailwind CSS configuration
└── tsconfig.json                       # TypeScript configuration
```

## Features

- **Authentication System**: Complete user authentication with login, signup, and password reset functionality
- **Job Listings**: Browse and search job listings
- **Job Management**: Create, edit, and manage job postings
- **User Dashboard**: Personal dashboard for users
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS
- **Server-side Rendering**: Fast page loads with Next.js
- **Toast Notifications**: Elegant notification system
- **Dark Mode**: Full dark mode support

## Technology Stack

- **Frontend**: Next.js 13+ (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 16.x or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/job_board_app.git
   cd job_board_app
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Authentication Flow

The app implements a complete authentication flow:

1. **Sign Up**: Create a new account
2. **Login**: Log in with email and password
3. **Password Reset**:
   - Enter email and click "Forgot password?"
   - Receive reset link via email
   - Follow link to reset password page
   - Create and confirm new password

## Database Schema

The application uses Supabase as its database with the following main tables:

- **users**: User accounts (managed by Supabase Auth)
- **profiles**: Additional user profile information
- **jobs**: Job listings
- **applications**: Job applications

## Deployment

This project can be easily deployed to Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables
4. Deploy!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 