import getOrganizationData from "@/api/organization/getOrganizationData";
import ManageBotsClient from "./ManageBotsClient";

export default async function ManageBotsPage() {
  const response = await getOrganizationData();
  const bots = response?.bots || [];

  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Manage bots</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">View, edit, or remove bots in your organization.</p>
      <ManageBotsClient initialBots={bots} />
    </div>
  );
}


