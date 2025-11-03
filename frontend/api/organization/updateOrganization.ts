"use server";

import getUserId from "../getUserId";

export default async function updateOrganization(
  uuid: string,
  name: string,
  industry: string
) {
  const userId = await getUserId();

  console.log({
    user_id: userId,
    uuid: uuid,
    new_organisation_name: name,
    new_industry: industry,
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}organisation/update-organisation`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        uuid: uuid,
        new_organisation_name: name,
        new_industry: industry,
      }),
    }
  );

  if (response.status === 302) {
    throw new Error("User not admin");
  }

  if (!response.ok && response.status !== 302) {
    throw new Error(response.statusText);
  }
}
