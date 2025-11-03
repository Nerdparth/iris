"use server";

import getOrganizationData from "../organization/getOrganizationData";

export default async function createBot(
  botData: {
    bot_name: string;
    bot_description: string;
    color_1: string;
    color_2: string;
    text_color: string;
  },
  file: File
) {
  const response = await getOrganizationData();
  const formData = new FormData();
  formData.append("organisation_uuid", response.organisation.uuid);
  formData.append("bot_name", botData.bot_name);
  formData.append("bot_description", botData.bot_description);
  formData.append("color_1", botData.color_1);
  formData.append("color_2", botData.color_2);
  formData.append("text_color", botData.text_color);
  formData.append("file", file);

  console.log(botData);
  console.log("Creating bot with data:", formData);

  return fetch(`${process.env.NEXT_PUBLIC_API_URL}bot/create-bot`, {
    method: "POST",
    body: formData,
  }).then((res) => res.json());
}
