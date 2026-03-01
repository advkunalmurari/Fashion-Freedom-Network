import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lwhtzpvfcvimwrplduyf.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3aHR6cHZmY3ZpbXdycGxkdXlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwODMyMTIsImV4cCI6MjA4MjY1OTIxMn0.85oWH6qPMnPFUE9EQJVjmHT-pkWXpi6kh5KIv4ceej0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
