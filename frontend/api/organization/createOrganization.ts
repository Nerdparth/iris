"use server";

import { redirect } from "next/navigation";
import getUserId from "../getUserId";

export default async function createOrganization(
  name: string,
  industry: string
) {
  const userId = await getUserId();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}organisation/create-organisation`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        organisation_name: name,
        industry,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  redirect("/dashboard");
}
