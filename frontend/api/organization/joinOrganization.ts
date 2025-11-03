"use server";

import { redirect } from "next/navigation";
import getUserId from "../getUserId";

export default async function joinOrganization(code: string) {
  const userId = await getUserId();
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}organisation/join-organisation`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: userId, organisation_code: code }),
    }
  );

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  redirect("/dashboard");
}
