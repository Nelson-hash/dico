import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Default values for when env vars are not available
const DEFAULT_URL = 'https://jufjeiginynroxxmisgo.supabase.co';
const DEFAULT_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1ZmplaWdpbnlucm94eG1pc2dvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwMjYwOTksImV4cCI6MjA2MTYwMjA5OX0.vxbWfmQnUWzylBBqCrkBJ6uoaX_G3FmtkKUe3pebryA';

let supabase: SupabaseClient;

try {
  // Try to use environment variables
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_KEY;
  
  // Initialize the client
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  // Log success message for debugging
  console.log('Supabase client initialized successfully');
} catch (error) {
  // Log error for debugging
  console.error('Error initializing Supabase client:', error);
  
  // Still create a client with default values so the app doesn't crash
  supabase = createClient(DEFAULT_URL, DEFAULT_KEY);
}

// Add a utility function to check the connection
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    // Try a simple query to check if Supabase is accessible
    const { data, error } = await supabase.from('words').select('count').limit(1);
    
    if (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }
    
    console.log('Supabase connection test successful');
    return true;
  } catch (error) {
    console.error('Error testing Supabase connection:', error);
    return false;
  }
};

export { supabase };
