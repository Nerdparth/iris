"use client";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function Sidebar({
  bots,
}: {
  bots: {
    uuid: string;
    bot_name: string;
  }[];
}) {
  const { "bot-id": botId } = useParams<{ "bot-id": string }>();
  const selectedBot = bots.find((bot) => bot.uuid === botId);

  return (
    <div className="w-64 border-r border-dashed border-gray-200 dark:border-gray-800 flex flex-col justify-between p-4 *:w-full">
      <div className="overflow-y-scroll">
        <Link
          href="/dashboard/new-bot"
          className="bg-blue-600 text-white font-medium flex justify-center py-2 rounded-lg w-full"
        >
          + Create new bot
        </Link>
        {bots.length === 0 ? (
          <p className="text-gray-500 text-center mt-4">
            No bots available. Create a new bot to get started.
          </p>
        ) : (
          bots.map((bot) => (
            <Link
              href={`/dashboard/bot/${bot.uuid}`}
              key={bot.uuid}
              className="mt-4 flex items-center gap-2 cursor-pointer"
            >
              <p
                className={
                  "text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-800 w-8 h-8 flex items-center justify-center rounded-full transition" +
                  (selectedBot?.uuid === bot.uuid
                    ? " bg-gray-200 dark:bg-gray-800"
                    : "")
                }
              >
                {bot.bot_name.charAt(0).toUpperCase()}
              </p>
              <h2 className="">{bot.bot_name}</h2>
            </Link>
          ))
        )}
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <Link href="/dashboard/manage-bots" className="border border-dashed border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 flex justify-center py-2 rounded-lg w-full hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
          Manage Bots
        </Link>
        <Link href="/dashboard/manage-organization" className="border border-gray-300 dark:border-gray-900 text-gray-800 dark:text-gray-200 flex justify-center py-2 rounded-lg w-full">
          Manage Organization
        </Link>
      </div>
    </div>
  );
}
