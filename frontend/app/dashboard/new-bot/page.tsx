"use client";
import { startTransition, useState } from "react";
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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(() => {
      const selectedColor = colors.find((c) => c.name === color);

      const fileInput = event.currentTarget.querySelector(
        "#file"
      ) as HTMLInputElement;
      if (fileInput && fileInput.files && fileInput.files.length > 0) {
        setFile(fileInput.files[0]);
      }

      if (selectedColor) {
        createBot(
          {
            bot_name: name,
            bot_description: description,
            color_1: selectedColor.color_1,
            color_2: selectedColor.color_2,
            text_color: selectedColor.text,
          },
          file
        ).then(() => {
          toast.success("Bot created successfully");
          router.push("/dashboard");
        });
      }
    });
  }

  const [color, setColor] = useState("blue");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const colors = [
    {
      name: "Vital Ocean",
      color_1: "#1CB5E0",
      color_2: "#000851",
      text: "#FFFFFF",
    },
    {
      name: "purple",
      color_1: "#8B5CF6",
      color_2: "#A78BFA",
      text: "#FFFFFF",
    },
    {
      name: "green",
      color_1: "#22C55E",
      color_2: "#4ADE80",
      text: "#FFFFFF",
    },
  ];
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Create New Bot - Basic Info</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label htmlFor="bot-name" className="mb-1 font-medium">
            Bot Name
          </label>
          <input
            type="text"
            id="bot-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 rounded-lg p-2 bg-white dark:bg-gray-800"
            placeholder="Enter bot name"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="bot-description" className="mb-1 font-medium">
            Bot Description
          </label>
          <textarea
            id="bot-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 rounded-lg p-2 bg-white dark:bg-gray-800"
            placeholder="Enter bot description"
            rows={4}
          ></textarea>
        </div>

        <div className="flex flex-col">
          <div className="flex gap-4">
            {colors.map((c) => (
              <label key={c.name} className="cursor-pointer">
                <input
                  type="radio"
                  name="color"
                  value={c.name}
                  checked={color === c.name}
                  onChange={() => setColor(c.name)}
                  className="hidden"
                />
                <div
                  className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                    color === c.name
                      ? "scale-110 border-gray-800 dark:border-white"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: c.color_1 }}
                />
              </label>
            ))}
          </div>

          <div className="w-lg">
            <div
              className="bg-gray-50 rounded-lg p-4"
              style={{
                background: `linear-gradient(90deg, ${
                  colors.find((c) => c.name === color)?.color_1
                } 0%, ${colors.find((c) => c.name === color)?.color_2} 100%)`,
              }}
            >
              <div className="h-10 w-1/2 rounded-lg bg-black/30"></div>
              <div className="h-10 w-4/6 ml-auto mt-2 rounded-lg bg-black/30"></div>
              <div className="h-10 w-2/12 mt-2 rounded-lg bg-black/30"></div>
              <div className="h-10 w-5/12 mt-2 rounded-lg bg-black/30"></div>
              <div className="h-10 w-4/12 ml-auto mt-2 rounded-lg bg-black/30"></div>
              <div className="h-10 w-3/12 mt-2 rounded-lg bg-black/30"></div>
              <div className="h-10 w-2/12 mt-2 rounded-lg bg-black/30"></div>
              <div className="h-10 w-full mt-2 rounded-lg flex items-center gap-2">
                <div className="h-10 w-10/12 rounded-lg bg-black/10 border border-black/20"></div>
                <div className="h-10 w-2/12 rounded-lg bg-black"></div>
              </div>
            </div>
          </div>
        </div>

        <label htmlFor="file" className="font-medium">
          Training file (only CSV,JSON, TXT, PDF)
        </label>
        <input className="" type="file" id="file" />

        <button
          type="submit"
          className="bg-blue-600 text-white font-medium py-2 rounded-lg mt-4 hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

function ChatPreview() {
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    document.documentElement.style.setProperty(`--${id}`, value);
  };
  return (
    <div className="flex flex-col">
      <label className="mb-1 font-medium">Colors:</label>
      <div className="flex gap-2">
        <div>
          <label htmlFor="bot-color-color_1">color_1 Color</label>
          <input
            type="color"
            id="bot-color-color_1"
            onChange={handleColorChange}
            // className="border border-gray-300 dark:border-gray-700 rounded-lg p-2 bg-white dark:bg-gray-800"
          />
        </div>
        <div>
          <label htmlFor="bot-color-color_2">color_2 Color</label>
          <input
            type="color"
            id="bot-color-color_2"
            onChange={handleColorChange}
            // className="border border-gray-300 dark:border-gray-700 rounded-lg p-2 bg-white dark:bg-gray-800"
          />
        </div>
      </div>
      <div className="w-lg">
        <div
          className="bg-gray-50 rounded-lg p-4"
          style={{
            background: `linear-gradient(90deg, var(--bot-color-color_1) 0%, var(--bot-color-color_2) 100%)`,
          }}
        >
          <div className="h-10 w-1/2 rounded-lg bg-black/30"></div>
          <div className="h-10 w-4/6 ml-auto mt-2 rounded-lg bg-black/30"></div>
          <div className="h-10 w-2/12 mt-2 rounded-lg bg-black/30"></div>
          <div className="h-10 w-5/12 mt-2 rounded-lg bg-black/30"></div>
          <div className="h-10 w-4/12 ml-auto mt-2 rounded-lg bg-black/30"></div>
          <div className="h-10 w-3/12 mt-2 rounded-lg bg-black/30"></div>
          <div className="h-10 w-2/12 mt-2 rounded-lg bg-black/30"></div>
          <div className="h-10 w-full mt-2 rounded-lg flex items-center gap-2">
            <div className="h-10 w-10/12 rounded-lg bg-black/10 border border-black/20"></div>
            <div className="h-10 w-2/12 rounded-lg bg-black"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
