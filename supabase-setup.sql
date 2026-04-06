-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  profile JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.tracking (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  date TEXT NOT NULL,
  exercises_completed JSONB DEFAULT '[]',
  meals_completed JSONB DEFAULT '[]',
  protein_consumed INTEGER DEFAULT 0,
  calories_consumed INTEGER DEFAULT 0,
  UNIQUE(user_id, date)
);

-- Allow public access (anon key)
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracking DISABLE ROW LEVEL SECURITY;
