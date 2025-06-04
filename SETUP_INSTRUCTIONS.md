# JobBoard App Setup Instructions

## Supabase Setup

The registration and authentication issues are occurring because Supabase environment variables are not configured. Follow these steps to set up Supabase:

1. **Create a Supabase Project**:
   - Go to [supabase.com](https://supabase.com) and sign up or log in
   - Create a new project with a name of your choice

2. **Get API Credentials**:
   - In your Supabase project dashboard, go to Settings → API
   - You'll need two values:
     - `URL`: The URL for your Supabase project
     - `anon public key`: The anonymous API key

3. **Create Environment Variables File**:
   - Create a `.env.local` file in the root of your project with the following content:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
   - Replace the values with your actual Supabase URL and anonymous key

4. **Create Database Tables**:
   - Navigate to the SQL Editor in your Supabase dashboard
   - Run the following SQL to create necessary tables:

```sql
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Create jobs table
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  description TEXT NOT NULL,
  salary TEXT,
  location JSONB NOT NULL,
  type TEXT NOT NULL,
  apply_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Set up Row Level Security
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Jobs are viewable by everyone" 
  ON public.jobs FOR SELECT 
  USING (true);

CREATE POLICY "Users can create their own jobs" 
  ON public.jobs FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own jobs" 
  ON public.jobs FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own jobs" 
  ON public.jobs FOR DELETE 
  USING (auth.uid() = user_id);

-- Create trigger function to create profiles automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

5. **Restart the App**:
   - After setting up the environment variables and database, restart your Next.js application

## Authentication Settings in Supabase

1. **Configure Email Auth**:
   - In Supabase dashboard, go to Authentication → Email Templates
   - Customize the email templates if needed
   
2. **Configure Site URL**:
   - Go to Authentication → URL Configuration
   - Set your site URL (e.g., http://localhost:3000 for development)

3. **Allow Signup**:
   - Ensure "Enable Sign Up" is turned on in the Authentication settings

With these settings in place, the registration and login functionality should work properly. 