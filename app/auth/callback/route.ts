import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as "email" | "recovery" | "invite" | null;
  const next = searchParams.get("next") ?? "/home";

  const supabase = await createClient();

  // Token-hash flow (email confirmation without PKCE — works across browsers/devices)
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    return NextResponse.redirect(
      `${origin}/signin?error=${encodeURIComponent("Your confirmation link has expired. Please sign in or request a new link.")}`
    );
  }

  // PKCE code flow (OAuth + standard email confirmation)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    const isPkce = error.message.toLowerCase().includes("pkce") || error.message.toLowerCase().includes("code verifier");
    const friendly = isPkce
      ? "Your link expired or was opened in a different browser. Please sign in below."
      : error.message;
    return NextResponse.redirect(`${origin}/signin?error=${encodeURIComponent(friendly)}`);
  }

  const err = searchParams.get("error_description") || searchParams.get("error") || "missing_code";
  return NextResponse.redirect(`${origin}/signin?error=${encodeURIComponent(err)}`);
}
