import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://bbonrwuubtdydgltolbb.supabase.co';

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJib25yd3V1YnRkeWRnbHRvbGJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwNzc4MjYsImV4cCI6MjA1NTY1MzgyNn0.2v0O0vXTy-Dw1llblxzCW8LdHGA77K9W7xDJLrEv_fo';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
