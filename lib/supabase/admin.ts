import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Using a flexible database type to handle Supabase type generation issues
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FlexibleDatabase = any;

export type AdminClient = SupabaseClient<FlexibleDatabase>;

// Service role client for server-side operations that bypass RLS
// Only use this in server actions and API routes
export function createAdminClient(): AdminClient {
  return createClient<FlexibleDatabase>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
