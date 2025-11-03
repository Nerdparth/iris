"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export function useChatSubscription(botUuid: string, initialChats: any[]) {
  const [chats, setChats] = useState(initialChats);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`public-Chats-bot_id=eq.${botUuid}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Chats",
          filter: `bot_id=eq.${botUuid}`,
        },
        (payload) => {
          console.log("Realtime event:", payload);

          setChats((prev) => {
            switch (payload.eventType) {
              case "INSERT":
                // Add new chat at the top
                return [payload.new, ...prev];

              case "UPDATE":
                // Replace the updated chat in the array
                return prev.map((chat) =>
                  chat.id === payload.new.id ? payload.new : chat
                );

              case "DELETE":
                // Remove deleted chat from the array
                return prev.filter((chat) => chat.id !== payload.old.id);

              default:
                return prev;
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [botUuid]);

  return chats;
}
