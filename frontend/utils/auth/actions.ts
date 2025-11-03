"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import createUser from "@/api/createUser";

export async function login(values: { email: string; password: string }) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword(values);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(values: { email: string; password: string }) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp(values);

  const { data } = await supabase.auth.getUser();

  if (!data.user) return { error: error?.message || "User creation failed" };

  await createUser(data.user.id || "");

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/account");
}
