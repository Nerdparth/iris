import getOrganizationData from "@/api/organization/getOrganizationData";
import EditForm from "./EditForm";
import OrganizationMembers from "./OrganizationMembers";

export default async function ManageOrganizationPage() {
  const response = await getOrganizationData();

  const organization = response.organisation;

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Manage Organization</h1>
      <p>Here you can manage your organization&apos;s settings and details.</p>
      <p className="font-semibold mt-8">Organization Code</p>
      <p className="text-xl font-bold w-fit border border-gray-200 dark:border-gray-800 mt-2 mb-4 p-2 rounded-lg">
        {organization.organisation_code.slice(0, 4)}-
        {organization.organisation_code.slice(4)}
      </p>

      <EditForm
        orgUuid={organization.uuid}
        orgName={organization.organisation_name}
        orgIndustry={organization.industry}
      />

      <OrganizationMembers orgUuid={organization.uuid} />
    </div>
  );
}
