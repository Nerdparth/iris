"use client";
import { useState } from "react";
import BasicInfo from "./basic-info";
import createBot from "@/api/bot/createbot";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function NewBotPage() {
  const router = useRouter();
  const [data, setData] = useState({
    bot_name: "",
    bot_description: "",
    color_1: "",
    color_2: "",
    text_color: "",
  });

  const [file, setFile] = useState<File>(new File([], ""));

  function handleSubmit() {
    // Handle the final submission of the bot data

    createBot(data, file)
      .then(() => {
        toast.success("Bot created successfully!");
        router.push("/dashboard");
      })
      .catch((error) => {
        toast.error("Error creating bot: " + error.message);
      });
  }

  return (
    <BasicInfo
      setData={setData}
      setFile={setFile}
      handleSubmit={handleSubmit}
    />
  );
}
