"use client";

import { useState } from "react";
import Messages from "./Messages";

export default function ChatCard({
  chat,
}: {
  chat: {
    id: string;
    uuid: string;
    ip_address: string;
    city: string;
    region: string;
    country: string;
    mood: number;
  };
}) {
  const [hovered, setHovered] = useState(false);
  const [chatsOpen, setChatsOpen] = useState(false);

  return (
    <>
      {chatsOpen && (
        <Messages setChatsOpen={setChatsOpen} chatId={chat.id} />
      )}
      <div
        key={chat.uuid}
        className="relative border border-gray-200 dark:border-gray-800 rounded-lg p-4"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {hovered && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white/50 dark:bg-black/50 backdrop-blur-xs rounded-lg">
            <button
              onClick={() => setChatsOpen(true)}
              className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg cursor-pointer"
            >
              Intervene
            </button>
          </div>
        )}

        <div className="flex flex-col items-center gap-4">
          {/* <p className="font-semibold">{chat.username}</p> */}
          <p>{chat.ip_address}</p>
          <p className="text-sm">
            📍{chat.city}, {chat.region}, {chat.country}
          </p>
          <div className="flex w-full items-center gap-2">
            <div className="block w-full h-4 p-1 b-gray-200 dark:b-gray-800 border border-gray-200 dark:border-gray-800 rounded-full">
              <div
                className={
                  "h-full bg-gray-500 rounded-full" +
                  (chat.mood > 8
                    ? " bg-red-500"
                    : chat.mood > 5
                    ? " bg-yellow-500"
                    : " bg-green-500")
                }
                style={{ width: chat.mood * 10 + "%" }}
              ></div>
            </div>
            <p>
              {chat.mood}
              <span className="text-xs">/10</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
