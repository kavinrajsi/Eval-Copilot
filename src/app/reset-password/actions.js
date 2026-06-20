"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function updatePassword(prevState, formData) {
  const password = formData.get("password");
  const confirm = formData.get("confirm");

  if (!password || password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }
  if (password !== confirm) {
    return { error: "Passwords do not match." };
  }

  const supabase = await createClient();

  // The recovery link must have established a session via /auth/callback.
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) {
    return { error: "Reset link expired or invalid. Request a new one." };
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
