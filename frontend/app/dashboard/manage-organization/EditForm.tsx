"use client";

import deleteOrganization from "@/api/organization/deleteOrganization";
import updateOrganization from "@/api/organization/updateOrganization";
import { startTransition, useState } from "react";
import { toast } from "sonner";

export default function EditForm({
  orgUuid,
  orgName,
  orgIndustry,
}: {
  orgUuid: string;
  orgName: string;
  orgIndustry: string;
}) {
  const [name, setName] = useState(orgName);
  const [industry, setIndustry] = useState(orgIndustry);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(() => {
      updateOrganization(orgUuid, name, industry)
        .then(() => {
          toast.success("Organization updated successfully");
        })
        .catch((error) => {
          toast.error("Failed to updating organization. Please try again.", {
            description: error.message,
          });
        });
    });
  }

  async function handleDelete() {
    startTransition(() => {
      deleteOrganization(orgUuid)
        .then(() => {
          toast.success("Organization deleted successfully");
        })
        .catch((error) => {
          toast.error("Failed to updating organization. Please try again.", {
            description: error.message,
          });
        });
    });
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Organization</h1>
      <p>This is where you can edit your organizations details.</p>
      <form className="flex flex-col gap-4 mt-6" onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label htmlFor="org-name" className="font-semibold mb-2">
            Organization Name
          </label>
          <input
            type="text"
            id="org-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 dark:border-gray-800 p-2 rounded-lg"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="org-industry" className="font-semibold mb-2">
            Industry
          </label>
          <input
            type="text"
            id="org-industry"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="border border-gray-300 dark:border-gray-800 p-2 rounded-lg"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded-lg mt-4 w-fit"
        >
          Save Changes
        </button>
      </form>

      <h1 className="text-4xl font-bold mb-4 mt-8">Danger Zone</h1>
      <button
        onClick={handleDelete}
        className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg"
      >
        Delete Organization
      </button>
    </div>
  );
}
