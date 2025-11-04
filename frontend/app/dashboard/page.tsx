import getOrganizationData from "@/api/organization/getOrganizationData";

export default async function DashboardPage() {
  const response = await getOrganizationData();



  if (!response || !response.organisation) {
    return (
      <div>
        <h1 className="text-4xl">Dashboard</h1>
        <p className="mt-4">No organization data available.</p>
      </div>
    );
  }
  return (
    <div>
      <h1 className="text-4xl">Dashboard</h1>
      <p className="mt-4">
        Welcome to the dashboard of {response.organisation.organisation_name}!
      </p>

      <p>
        You have {response.bots.length} bots in your organization.
        {response.bots.length === 0
          ? " Please create a new bot to get started."
          : " Click on a bot in the sidebar to manage it."}
      </p>
    </div>
  );
}
