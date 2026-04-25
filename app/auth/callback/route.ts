import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/home";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      console.log("[auth/callback] session created, redirecting to", next);
      return NextResponse.redirect(`${origin}${next}`);
    }
    console.error("[auth/callback] exchangeCodeForSession error:", error.message);
    const isPkce = error.message.toLowerCase().includes("pkce") || error.message.toLowerCase().includes("code verifier");
    const friendly = isPkce
      ? "Your link expired or was opened in a different browser. Please sign in below."
      : error.message;
    return NextResponse.redirect(`${origin}/signin?error=${encodeURIComponent(friendly)}`);
  }

  const err = searchParams.get("error_description") || searchParams.get("error") || "missing_code";
  console.error("[auth/callback] no code in callback. params:", err);
  return NextResponse.redirect(`${origin}/signin?error=${encodeURIComponent(err)}`);
}
