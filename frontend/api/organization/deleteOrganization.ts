"use server";

import { redirect } from "next/navigation";
import getUserId from "../getUserId";

export default async function deleteOrganization(uuid: string) {
  const userId = await getUserId();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}organisation/delete-organisation?uuid=${uuid}&user_id=${userId}`,

    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  redirect("/dashboard");
}
