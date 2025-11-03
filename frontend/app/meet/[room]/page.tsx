"use client";

import { useParams, useSearchParams } from "next/navigation";
import JitsiMeeting from "@/component/jeetsee";
export default function MeetingPage() {
  const { room } = useParams();
  const searchParams = useSearchParams();
  const isHost = searchParams.get("host") === "true";

  return (
    <div className="w-full h-screen">
      <JitsiMeeting
        roomName={room as string}
        displayName={isHost ? "Organizer" : "Participant"}
      />
    </div>
  );
}
