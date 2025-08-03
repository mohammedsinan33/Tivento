import { createClient } from '@supabase/supabase-js'

// Helper function to get environment variables safely
const getEnvVar = (name: string): string => {
  const value = process.env[name]
  if (!value) {
    console.error(`Missing environment variable: ${name}`)
    // Return empty string to prevent build failures, will be handled at runtime
    return ''
  }
  return value
}

const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL')
const supabaseKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY')

// Create client with fallback values to prevent build errors
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key'
)