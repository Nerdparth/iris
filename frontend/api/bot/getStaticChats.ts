// utils/supabase/getChats.ts
import { createClient } from "@/utils/supabase/server";

export default async function getStaticChats(chatId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("ChatMessages")
    .select("*")
    .eq("bot_id", chatId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching chats:", error);
    return [];
  }

  return data;
}
