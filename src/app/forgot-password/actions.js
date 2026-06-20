"use server";

import { headers } from "next/headers";

import { createClient } from "@/lib/supabase/server";

// Resolve the public origin used to build the reset link. Prefer the explicit
// NEXT_PUBLIC_SITE_URL so it stays stable across local / preview / prod; fall
// back to the request's forwarded host when it isn't set.
async function resolveOrigin() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

export async function requestPasswordReset(prevState, formData) {
  const email = formData.get("email");
  if (!email) return { error: "Enter your email address." };

  const supabase = await createClient();
  const origin = await resolveOrigin();

  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/reset-password`,
  });

  // Always respond neutrally — never reveal whether an account exists.
  return {
    message:
      "If an account exists for that email, a password reset link is on its way.",
  };
}
