import getChats from "@/api/chats/getChats";
import getOrganizationData from "@/api/organization/getOrganizationData";

import ChatList from "./chats";
// import ChatCard from "./ChatCard";

export default async function BotPage({
  params,
}: {
  params: Promise<{ "bot-uuid": string }>;
}) {
  const { "bot-uuid": botUuid } = await params;

  const response = await getOrganizationData();

  const bot = response.bots.find(
    (bot: { uuid: string; bot_name: string; bot_description: string }) =>
      bot.uuid === botUuid
  );
  // const chats = bot ? bot.chats : [];

  const chats = await getChats(botUuid);

  if (!bot) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Bot Not Found</h1>
        <p>The bot {botUuid} does not exist.</p>
      </div>
    );
  }
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{bot.bot_name}</h1>
      <p className="mb-4">{bot.bot_description}</p>
      <h2 className="text-xl font-semibold mb-2">Chats</h2>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <ChatList botUuid={botUuid} initialChats={chats} />
      </div>
    </div>
  );
}
