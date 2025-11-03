// utils/supabase/getChats.ts
import { createClient } from "@/utils/supabase/server";

export default async function getChats(botUuid: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("Chats")
    .select("*")
    .eq("bot_id", botUuid)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching chats:", error);
    return [];
  }

  return data;
}
