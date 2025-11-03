"use client";

import { createClient } from "@/utils/supabase/client";

type SendMessageParams = {
  chatId: string;
  message: string;
  sender?: string; // expected values like 'user' or 'bot'
};

export async function sendMessage({ chatId, message, sender = 'bot' }: SendMessageParams) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("ChatMessages")
    .insert({
      chat_id: chatId,
      sender,
      chat_messages: message,
    })
    .select("*")
    .single();

  if (error) {
    console.error("Error sending message:", error);
    throw error;
  }

  return data;
}


