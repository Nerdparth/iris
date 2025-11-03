import { redirect } from "next/navigation";
import getUserId from "../getUserId";

export default async function getOrganizationData() {
  const userId = await getUserId();
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}organisation/dashboard-data?user_id=${userId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  console.log("Response status:", response.status);

  if (response.status === 302) {
    redirect("/no-organization");
  }

  if (!response.ok && response.status !== 302) {
    throw new Error(response.statusText);
  }

  return response.json();
}
