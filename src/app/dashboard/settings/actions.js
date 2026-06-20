"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

// Update the display name stored in Supabase user_metadata.full_name —
// the value NavUser and the dashboard read for the signed-in user.
export async function updateProfile(prevState, formData) {
  const fullName = (formData.get("full_name") ?? "").toString().trim();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Your session expired. Sign in again." };
  }

  const { error } = await supabase.auth.updateUser({
    data: { full_name: fullName },
  });
  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return { ok: true, message: "Profile saved." };
}

// Set a new password for the signed-in user.
export async function changePassword(prevState, formData) {
  const password = formData.get("password");
  const confirm = formData.get("confirm");

  if (!password || password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }
  if (password !== confirm) {
    return { error: "Passwords do not match." };
  }

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) {
    return { error: "Your session expired. Sign in again." };
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return { ok: true, message: "Password updated." };
}
