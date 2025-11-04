"use client";

export async function deleteBot(uuid: string) {
  console.log("Deleting bot with uuid:", uuid);
  console.log("API URL:", `${process.env.NEXT_PUBLIC_API_URL}bot/delete-bot/${uuid}`);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}bot/delete-bot/${uuid}`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: res.statusText }));
    const message = errorData.error || errorData.message || `Failed to delete bot ${uuid}`;
    throw new Error(message);
  }

  return res.json();
}


