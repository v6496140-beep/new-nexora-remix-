import { createClient } from '@supabase/supabase-js';

// If credentials are missing, we use placeholder values to prevent the app from crashing.
// In production, please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-id.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key-placeholder';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Supabase credentials missing. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file to enable database features.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
