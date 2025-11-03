"use client";

import { login } from "@/utils/auth/actions";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export default function SignInPage() {
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(async () => {
      const res = await login({ email, password });
      if (res?.error) {
        toast.error(`Login error: ${res.error}`);
      }
    });
  };
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <h1 className="mb-4 text-3xl font-bold">Sign In</h1>
      <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-64 rounded-lg border border-gray-300 dark:border-gray-600 p-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-64 rounded-lg border border-gray-300 dark:border-gray-600 p-2"
        />
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
        >
          {isPending ? "Signing in..." : "Sign In"}
        </button>
      </form>
      <Link href="/signup" className="mt-4 text-blue-500 hover:underline">
        Don&apos;t have an account? Sign Up
      </Link>
    </div>
  );
}
