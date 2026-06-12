import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || 'https://pgtuzwvlmcgivqsrscrn.supabase.co'
const supabaseKey = process.env.SUPABASE_ANON_KEY || ''

export const supabase = supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null
