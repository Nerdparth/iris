import { createClient } from "@/utils/supabase/server";

export async function SignedIn({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }
  return <>{children}</>;
}

export async function SignedOut({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return null;
  }
  return <>{children}</>;
}
