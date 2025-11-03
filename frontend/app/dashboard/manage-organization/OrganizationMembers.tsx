"use client";

import { useEffect, useState } from "react";
import getOrganizationMembers from "@/api/organization/getOrganizationMembers";

type Member = {
  id: number;
  email: string;
  is_admin: boolean;
};

export default function OrganizationMembers({ orgUuid }: { orgUuid: string }) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMembers() {
      try {
        setLoading(true);
        const data = await getOrganizationMembers(orgUuid);
        // Handle different response structures
        setMembers(Array.isArray(data) ? data : data.members || []);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to load members");
      } finally {
        setLoading(false);
      }
    }

    fetchMembers();
  }, [orgUuid]);

  if (loading) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Organization Members</h2>
        <p className="text-sm text-gray-500">Loading members...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Organization Members</h2>
        <p className="text-sm text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Organization Members</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border border-dashed border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
          <thead className="bg-gray-50/60 dark:bg-gray-900/30">
            <tr>
              <th className="p-3 border-b border-dashed border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 text-sm">
                Email
              </th>
              <th className="p-3 border-b border-dashed border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 text-sm">
                Role
              </th>
            </tr>
          </thead>
          <tbody>
            {members.length === 0 ? (
              <tr>
                <td colSpan={2} className="p-6 text-center text-gray-500 text-sm">
                  No members found
                </td>
              </tr>
            ) : (
              members.map((member) => (
                <tr
                  key={member.id}
                  className="hover:bg-gray-50/60 dark:hover:bg-gray-900/20 transition-colors"
                >
                  <td className="p-3 border-b border-dashed border-gray-200 dark:border-gray-800">
                    {member.email}
                  </td>
                  <td className="p-3 border-b border-dashed border-gray-200 dark:border-gray-800">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        member.is_admin
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
                      }`}
                    >
                      {member.is_admin ? "Admin" : "Member"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

