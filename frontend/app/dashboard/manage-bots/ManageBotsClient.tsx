"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import updateBot from "@/api/bot/updateBot";
import { deleteBot } from "@/api/bot/deleteBot";

type Bot = {
  uuid: string;
  bot_name: string;
  bot_description: string;
  iframe: string;
  color_1?: string;
  color_2?: string;
  text_color?: string;
};

export default function ManageBotsClient({ initialBots }: { initialBots: Bot[] }) {
  const colors = [
    {
      name: "Vital Ocean",
      color_1: "#1CB5E0",
      color_2: "#000851",
      text: "#FFFFFF",
    },
    { name: "purple", color_1: "#8B5CF6", color_2: "#A78BFA", text: "#FFFFFF" },
    { name: "green", color_1: "#22C55E", color_2: "#4ADE80", text: "#FFFFFF" },
  ];
  const [bots, setBots] = useState<Bot[]>(initialBots);
  const [saving, setSaving] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const sortedBots = useMemo(
    () => [...bots].sort((a, b) => a.bot_name.localeCompare(b.bot_name)),
    [bots]
  );

  async function onSave(bot: Bot) {
    try {
      setSaving(bot.uuid);
      const updatedBot = await updateBot({
        bot_uuid: bot.uuid,
        bot_name: bot.bot_name,
        bot_description: bot.bot_description,
        color_1: bot.color_1 || colors[0].color_1,
        color_2: bot.color_2 || colors[0].color_2,
        text_color: bot.text_color || colors[0].text,
      });
      toast.success("Saved", { description: `${bot.bot_name} updated` });
    } catch (err: any) {
      toast.error("Failed to save", { description: err?.message || "Not implemented" });
    } finally {
      setSaving(null);
    }
  }

  async function onDelete(uuid: string) {
    const target = bots.find((b) => b.uuid === uuid);
    if (!target) return;
    try {
      setDeleting(uuid);
      await deleteBot(uuid);
      setBots((prev) => prev.filter((b) => b.uuid !== uuid));
      toast.success("Deleted", { description: `${target.bot_name} removed` });
    } catch (err: any) {
      toast.error("Failed to delete", { description: err?.message || "Not implemented" });
    } finally {
      setDeleting(null);
    }
  }

  function updateLocal(uuid: string, field: keyof Bot, value: string) {
    setBots((prev) => prev.map((b) => (b.uuid === uuid ? { ...b, [field]: value } : b)));
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border border-dashed border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
        <thead className="bg-gray-50/60 dark:bg-gray-900/30">
          <tr>
            <th className="p-3 border-b border-dashed border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 text-sm">Name</th>
            <th className="p-3 border-b border-dashed border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 text-sm">Description</th>
            <th className="p-3 border-b border-dashed border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 text-sm">Color</th>
            <th className="p-3 border-b border-dashed border-gray-200 dark:border-gray-800 w-48 text-gray-600 dark:text-gray-300 text-sm">Actions</th>
            <th className="p-3 border-b border-dashed border-gray-200 dark:border-gray-800 w-48 text-gray-600 dark:text-gray-300 text-sm">iFrame</th>
          </tr>
        </thead>
        <tbody>
          {sortedBots.map((bot) => {
            console.log(bot);

            const activeColor =
              colors.find((c) => c.color_1 === bot.color_1 && c.color_2 === bot.color_2) ||
              colors[0];

            return (
              <tr key={bot.uuid} className="align-top hover:bg-gray-50/60 dark:hover:bg-gray-900/20 transition-colors">
                <td className="p-3 border-b border-dashed border-gray-200 dark:border-gray-800">
                  <input
                    value={bot.bot_name}
                    onChange={(e) => updateLocal(bot.uuid, "bot_name", e.target.value)}
                    className="w-full text-sm border border-gray-200 dark:border-gray-800 rounded-md px-2 py-1 bg-white dark:bg-transparent focus:outline-none focus:ring-2 focus:ring-gray-300"
                  />
                </td>
                <td className="p-3 border-b border-dashed border-gray-200 dark:border-gray-800">
                  <textarea
                    value={bot.bot_description}
                    onChange={(e) => updateLocal(bot.uuid, "bot_description", e.target.value)}
                    rows={2}
                    className="w-full text-sm border border-gray-200 dark:border-gray-800 rounded-md px-2 py-1 bg-white dark:bg-transparent focus:outline-none focus:ring-2 focus:ring-gray-300"
                  />
                </td>
                <td className="p-3 border-b border-dashed border-gray-200 dark:border-gray-800">
                  <div className="flex gap-2">
                    {colors.map((c) => (
                      <label key={c.name} className="cursor-pointer">
                        <input
                          type="radio"
                          name={`color-${bot.uuid}`}
                          value={c.name}
                          checked={activeColor.name === c.name}
                          onChange={() => {
                            updateLocal(bot.uuid, "color_1", c.color_1);
                            updateLocal(bot.uuid, "color_2", c.color_2);
                            updateLocal(bot.uuid, "text_color", c.text);
                          }}
                          className="hidden"
                        />
                        <div
                          className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                            activeColor.name === c.name
                              ? "scale-110 border-gray-800 dark:border-white"
                              : "border-transparent"
                          }`}
                          style={{ backgroundColor: c.color_1 }}
                        />
                      </label>
                    ))}
                  </div>
                </td>
                <td className="p-3 border-b border-dashed border-gray-200 dark:border-gray-800">
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-gray-900/30 disabled:opacity-50 text-sm"
                      disabled={saving === bot.uuid}
                      onClick={() => onSave(bot)}
                    >
                      {saving === bot.uuid ? "Saving…" : "Save"}
                    </button>
                    <button
                      className="px-3 py-2 rounded-md border border-red-300/60 text-red-700 dark:text-red-400 bg-white dark:bg-transparent hover:bg-red-50/60 dark:hover:bg-red-900/10 disabled:opacity-50 text-sm"
                      disabled={deleting === bot.uuid}
                      onClick={() => onDelete(bot.uuid)}
                    >
                      {deleting === bot.uuid ? "Deleting…" : "Delete"}
                    </button>
                  </div>
                </td>
                <td className="p-3 border-b border-dashed border-gray-200 dark:border-gray-800">
                  <button
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(bot.iframe);
                        toast.success("Copied to clipboard", { description: "iFrame copied to clipboard" });
                      } catch (err) {
                        console.error("Failed to copy:", err);
                      }
                    }}
                    className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-gray-900/30 disabled:opacity-50 text-sm">Copy iFrame</button>
                </td>
              </tr>)
          })}
          {sortedBots.length === 0 && (
            <tr>
              <td colSpan={5} className="p-6 text-center text-gray-500 text-sm">
                No bots found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}


