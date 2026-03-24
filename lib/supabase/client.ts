import { createBrowserClient } from "@supabase/ssr";

// Using a flexible database type to handle Supabase type generation issues
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FlexibleDatabase = any;

export function createClient() {
  return createBrowserClient<FlexibleDatabase>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
