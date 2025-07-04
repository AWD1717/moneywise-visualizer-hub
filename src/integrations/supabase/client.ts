
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = "https://uuakplblvsikesnxuocn.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1YWtwbGJsdnNpa2Vzbnh1b2NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5OTA3MDAsImV4cCI6MjA2NDU2NjcwMH0.mNXN-4wLSk_xtjOjJp9RAxwV9SvTV5baydL_qNjw2P0"

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
