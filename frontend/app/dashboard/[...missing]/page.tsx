import Link from "next/link";

export default function DashboardNotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg text-gray-600">
        The dashboard page you are looking for does not exist.
      </p>
      <Link href="/dashboard" className="text-blue-500 hover:underline">
        Go back to Dashboard
      </Link>
    </div>
  );
}
