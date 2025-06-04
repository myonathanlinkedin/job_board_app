# Job Board Application

A modern job board application built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

- 🔍 Browse and search jobs
- 📝 Post, edit, and delete job listings
- 👥 User authentication
- 💼 Company profiles
- 📱 Responsive design

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Supabase](https://supabase.com/) - Database and authentication

## Project Structure

The project follows a Domain-Driven Design (DDD) approach:

```
/
├── app/                          # Next.js App Router (UI Entry)
│   ├── (auth)/                   # Auth routes (e.g., login, signup)
│   ├── dashboard/                # User dashboard (view/edit/delete jobs)
│   ├── jobs/                     # Public job board and job detail pages
│
├── domains/                      # DDD structure by feature
│   ├── job/                      # Job domain
│   │   ├── domain/               # Entities and value objects
│   │   ├── application/          # Use cases and DTOs
│   │   └── infrastructure/       # Database adapters
│
├── components/                   # Reusable UI components
├── lib/                          # Shared utilities
└── styles/                       # Global styles
```

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

## Database Schema

The application uses the following Supabase tables:

- `jobs` - Job listings
- `profiles` - User profiles

## License

[MIT](LICENSE) 