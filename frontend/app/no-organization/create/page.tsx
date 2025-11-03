"use client";

import createOrganization from "@/api/organization/createOrganization";
import Link from "next/link";
import { startTransition, useState } from "react";
import { toast } from "sonner";

export default function CreateOrganizationPage() {
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(() => {
      createOrganization(name, industry).catch((error) => {
        console.error("Error creating organization:", error);
        toast.error("Failed to create organization. Please try again.", {
          description: error.message,
        });
      });
    });
  }

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] gap-8">
      <h1 className="text-4xl ">Create an Organization</h1>
      <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Organization Name"
          className="border border-gray-300 rounded-lg p-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Organization Industry"
          className="border border-gray-300 rounded-lg p-2"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg w-fit h-fit mx-auto cursor-pointer"
        >
          Create
        </button>
      </form>
      <Link href="/no-organization" className="text-gray-500 hover:underline">
        Don&apos;t want to create an organization? Go Back
      </Link>
    </div>
  );
}
