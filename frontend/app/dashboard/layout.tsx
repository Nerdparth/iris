import { SignedIn, SignedOut } from "@/components/auth";
import Sidebar from "./Sidebar";
import getOrganizationData from "@/api/organization/getOrganizationData";
// import { SignedIn, SignedOut } from "@clerk/nextjs";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const response = await getOrganizationData();

  return (
    <>
      <SignedIn>
        <div className="flex h-[calc(100vh-4rem)] gap-4 font-sans border-t border-gray-200 dark:border-gray-800">
          <Sidebar bots={response.bots} />
          <div className="flex-1 p-4 overflow-y-scroll relative">
            <main>{children}</main>
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
          <p className="text-gray-500">
            Please sign in to access the dashboard.
          </p>
        </div>
      </SignedOut>
    </>
  );
}
