"use server";

import getUserId from "../getUserId";

export default async function updateBot(
    botData: {
      bot_uuid: string;
      bot_name: string;
      bot_description: string;
      color_1: string;
      color_2: string;
      text_color: string;
  }
) {
  const userId = await getUserId();

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}bot/update-bot`, {
    method: "POST",
    body: JSON.stringify({
      ...botData,
      user_id: userId,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: response.statusText }));
    const message = errorData.error || errorData.message || `Failed to update bot ${botData.bot_uuid}`;
    throw new Error(message);
  }

  return response.json();
}


