import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://lyumiqiurepqetrhsqdg.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5dW1pcWl1cmVwcWV0cmhzcWRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEwNTY3OTAsImV4cCI6MjEwNjYzMjc5MH0.mCi2aU3KmEVjXA-AtcYkxwWMf2ELFqCJPiz6ezsx0qs";
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5dW1pcWl1cmVwcWV0cmhzcWRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTA1Njc5MCwiZXhwIjoyMTA2NjMyNzkwfQ.AQ_9UB71arATA64eGDCG6mUgN62JGWHelAs8-AvncSk";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
