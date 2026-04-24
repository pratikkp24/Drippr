"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();
  const supabase = createClient();
  async function onSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }
  return (
    <button
      onClick={onSignOut}
      className="text-[13px] text-text-2 hover:text-primary underline-offset-4 hover:underline"
    >
      Sign out
    </button>
  );
}
