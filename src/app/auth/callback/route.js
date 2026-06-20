import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

// Handles the redirect from a Supabase auth email link (password recovery,
// email confirmation). Exchanges the PKCE `code` for a session — which sets the
// auth cookies — then forwards the user on to `next`.
export async function GET(request) {
  const code = request.nextUrl.searchParams.get("code");
  const next = request.nextUrl.searchParams.get("next") ?? "/reset-password";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  return NextResponse.redirect(new URL("/login?error=auth", request.url));
}
