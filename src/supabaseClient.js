import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rwiuevnywuapaqjzeubz.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3aXVldm55d3VhcGFxanpldWJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwMTEyMjEsImV4cCI6MjEwMzU4NzIyMX0.3jJuKKlPHubCSJlRoYo1pub-ugyE6yXp9MxaFfGKuuU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
