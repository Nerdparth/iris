"use client";
import joinOrganization from "@/api/organization/joinOrganization";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Link from "next/link";
import { startTransition, useState } from "react";

export default function NoOrganizationPage() {
  const [code, setCode] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(() => {
      joinOrganization(code).catch((error) => {
        console.error("Error joining organization:", error);
      });
    });
  }

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] gap-8">
      <h1 className="text-4xl ">Join or Create an Organization</h1>
      <div className="grid min-h-80 grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <Link
          href="/no-organization/create"
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg w-fit h-fit m-auto cursor-pointer"
        >
          Create Organization
        </Link>
        <div className="flex flex-col gap-4">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 items-center"
          >
            <InputOTP
              maxLength={8}
              onChange={(value) => setCode(value.toUpperCase())}
              value={code}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
                <InputOTPSlot index={6} />
                <InputOTPSlot index={7} />
              </InputOTPGroup>
            </InputOTP>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg w-fit h-fit mx-auto cursor-pointer">
              Join
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
