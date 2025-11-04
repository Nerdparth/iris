"use client";

import { useChatSubscription } from "@/api/bot/getChats";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { sendMessage } from "@/api/bot/sendMessage";
import { toggleIntervention } from "@/api/bot/toggleIntervein";

export default function Messages({
  setChatsOpen,
  chatId,
}: {
  setChatsOpen: (open: boolean) => void;
  chatId: string;
}) {
  const { chats, loading } = useChatSubscription(chatId);

  useEffect(() => {
    toggleIntervention(chatId, true);
  }, []);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [input, setInput] = useState("");

  useEffect(() => {
    // Scroll to bottom on mount and whenever messages change
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [loading, chats.length]);

  return (
    <div className="absolute top-0 left-0 h-full w-full z-10 bg-white/50 backdrop-blur-md flex items-center justify-center">
      <div ref={scrollRef} className="bg-white p-4 relative rounded-lg max-w-2xl w-full h-4/5 overflow-y-scroll m-8 border border-gray-200">
        <button
          className="fixed bg-white h-8 w-8 rounded-md border"
          onClick={() => {
            setChatsOpen(false)
            toggleIntervention(chatId, false);
          }}
        >
          ✕
        </button>
        <div className="flex flex-col gap-2 pb-16">
          {loading && (
            <p className="text-sm text-gray-500 text-center">Loading…</p>
          )}
          {!loading && chats.length === 0 && (
            <p className="text-sm text-gray-400 text-center">No messages</p>
          )}
          {!loading && chats.length > 0 &&
            chats.map((msg) => {
              const isBot = msg.sender === 'bot';
              return (
                <p
                  key={msg.id}
                  className={
                    "px-3 py-2 max-w-[75%] w-fit whitespace-pre-wrap break-words rounded-2xl shadow-sm" +
                    (isBot ? " ml-auto" : " mr-auto") +
                    (isBot
                      ? " bg-blue-600 text-white rounded-br-sm"
                      : " bg-gray-100 text-gray-900 rounded-bl-sm")
                  }
                >
                  {msg.chat_messages}
                </p>
              );
            })}
        </div>
        <div className="sticky bottom-0 left-0 right-0 bg-white pt-2">
          <form
            className="flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const trimmed = input.trim();
              if (!trimmed) return;
              (async () => {
                try {
                  await sendMessage({ chatId, message: trimmed });
                  setInput("");
                  if (scrollRef.current) {
                    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                  }
                } catch (err: any) {
                  console.error(err);
                  const description = err?.message || "Failed to send message";
                  toast.error("Error", { description });
                }
              })();
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message…"
              className="flex-1 border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-blue-600 text-white font-medium disabled:opacity-50"
              disabled={!input.trim()}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
