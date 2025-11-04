"use client";

import { signup } from "@/utils/auth/actions";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export default function SignUpPage() {
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(async () => {
      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      const res = await signup({ email, password });
      if (res?.error) {
        toast.error(`Signup error: ${res.error}`);
      }
      
      try {
        const url = new URL("https://melodic-holies-jamey.ngrok-free.dev/api/send-email");
        url.searchParams.append("recipient_email", email);
        url.searchParams.append("user_name", email);
        url.searchParams.append("body_message", "Thank you for signing up to Akkal Ki Fauj!");
  
        const response = await fetch(url.toString(), {
          method: "POST",
        });
  
        if (response.ok) {
          toast.success("Signup successful! Welcome email sent 🎉");
        } else {
          toast.warning('signup but email not sent');
        }
      } catch (error) {
        console.error("Email sending failed:", error);
        toast.warning("Signup successful, but email service is unavailable.");
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
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-64 rounded-lg border border-gray-300 dark:border-gray-600 p-2"
        />
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
        >
          {isPending ? "Signing up..." : "Sign Up"}
        </button>
      </form>
      <Link href="/signin" className="mt-4 text-blue-500 hover:underline">
        Already have an account? Sign In
      </Link>
    </div>
  );
}
