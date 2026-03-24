import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Using a flexible database type to handle Supabase type generation issues
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FlexibleDatabase = any;

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient<FlexibleDatabase>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}
