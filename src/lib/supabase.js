import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zffqgajoxkgvveipqvoy.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmZnFnYWpveGtndnZlaXBxdm95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3MTk3NTksImV4cCI6MjA5MzI5NTc1OX0.yEhwOJZ9E8Fct0t10kQSFrUzdEd07HLongG52Ep4zcU'

export const supabase = createClient(supabaseUrl, supabaseKey)
