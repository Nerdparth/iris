"use client";
import { useChatSubscription } from "@/api/chats/getLiveChats";
import ChatCard from "./ChatCard";

// Client component

export default function ChatList({
  botUuid,
  initialChats,
}: {
  botUuid: string;
  initialChats: any[];
}) {
  const chats = useChatSubscription(botUuid, initialChats);

  return (
    <>
      {chats.map((chat) => (
        <ChatCard key={chat.id} chat={chat} />
      ))}
    </>
  );
}
