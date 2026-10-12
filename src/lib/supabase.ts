import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://zkiqeyhmoipzqawqqrvv.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpraXFleWhtb2lwenFhd3FxcnZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3MjU0NTAsImV4cCI6MjA4MjMwMTQ1MH0.RTwJEh1x_C1Tr5VdTXyVJDxebuOQwGsCeUiyB7MGYGk";
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpraXFleWhtb2lwenFhd3FxcnZ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjcyNTQ1MCwiZXhwIjoyMDgyMzAxNDUwfQ.ptlyfuhFDLW0Mp_Aec2Bxks-UPJ2FJAW_EqvLsN6tmc";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

// 👇 ADD THIS (for development only)
if (import.meta.env.DEV) {
  // @ts-ignore
  window.supabase = supabase;
}
