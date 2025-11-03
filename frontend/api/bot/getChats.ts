"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export function useChatSubscription(chatId: string) {
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // --- 1️⃣ Fetch initial chats ---
    async function fetchChats() {
      const { data, error } = await supabase
        .from("ChatMessages")
        .select("*")
        .eq("chat_id", chatId)
        .order("created_at", { ascending: true }); // oldest → newest

      if (error) {
        console.error("Error fetching chats:", error);
      } else {
        setChats(data || []);
      }

      setLoading(false);
    }

    fetchChats();

    // --- 2️⃣ Subscribe to realtime updates ---
    const channel = supabase
      .channel(`chat-messages-${chatId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "ChatMessages",
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          console.log("Realtime event:", payload);

          setChats((prev) => {
            switch (payload.eventType) {
              case "INSERT":
                return [...prev, payload.new]; // append new message at end

              case "UPDATE":
                return prev.map((msg) =>
                  msg.id === payload.new.id ? payload.new : msg
                );

              case "DELETE":
                return prev.filter((msg) => msg.id !== payload.old.id);

              default:
                return prev;
            }
          });
        }
      )
      .subscribe();

    // --- 3️⃣ Cleanup on unmount ---
    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId]);

  return { chats, loading };
}
