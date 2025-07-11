
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = "https://uuakplblvsikesnxuocn.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1YWtwbGJsdnNpa2Vzbnh1b2NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5OTA3MDAsImV4cCI6MjA2NDU2NjcwMH0.mNXN-4wLSk_xtjOjJp9RAxwV9SvTV5baydL_qNjw2P0"

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// Add connection logging
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Supabase auth state changed:', event, session?.user?.id);
});

// Test connection on initialization
const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('cashflows').select('count').limit(1);
    if (error) {
      console.error('Supabase connection error:', error);
    } else {
      console.log('Supabase connected successfully');
    }
  } catch (err) {
    console.error('Supabase connection test failed:', err);
  }
};

testConnection();
