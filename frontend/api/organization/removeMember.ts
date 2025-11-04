"use server";

import getUserId from "../getUserId";

export default async function removeMember(user_uuid: string) {
  const admin_uuid = await getUserId();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}organisation/remove-member`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        admin_uuid,
        user_uuid,
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: response.statusText }));
    const message = errorData.error || errorData.message || `Failed to remove member ${user_uuid}`;
    throw new Error(message);
  }

  return response.json();
}

