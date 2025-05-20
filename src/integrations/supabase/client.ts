
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://yvxurthbghjarggiecsa.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2eHVydGhiZ2hqYXJnZ2llY3NhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NTg2NjUsImV4cCI6MjA2MzIzNDY2NX0.IbDQkLvLKfoypAifNt-IFYjoY5wgZ7-SGKFOcmz_EKE";

// Make sure localStorage is defined before using it
const storage = typeof window !== 'undefined' ? localStorage : undefined;

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: storage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
