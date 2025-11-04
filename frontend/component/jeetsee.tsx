"use client";

import { useEffect, useRef, useState } from "react";

interface JitsiMeetingProps {
  roomName: string;
  displayName: string;
}

export default function JitsiMeeting({ roomName, displayName }: JitsiMeetingProps) {
  const jitsiContainer = useRef<HTMLDivElement>(null);
  const [showModal, setShowModal] = useState(false);
  const [emails, setEmails] = useState("");
  const [isSending, setIsSending] = useState(false);

  const meetingLink = `${typeof window !== "undefined" ? window.location.origin : ""}/meet/${roomName}`;

  useEffect(() => {
    const loadJitsi = () => {
      if (!(window as any).JitsiMeetExternalAPI) return;

      const domain = "meet.jit.si";
      const options = {
        roomName,
        parentNode: jitsiContainer.current,
        userInfo: { displayName },
        configOverwrite: {
          disableDeepLinking: true,
          prejoinPageEnabled: false,
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          enableLobby: false, // ✅ Disable waiting room
        },
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
        },
      };

      new (window as any).JitsiMeetExternalAPI(domain, options);
    };

    // Load external Jitsi script only once
    if (!document.getElementById("jitsi-script")) {
      const script = document.createElement("script");
      script.src = "https://meet.jit.si/external_api.js";
      script.id = "jitsi-script";
      script.async = true;
      script.onload = loadJitsi;
      document.body.appendChild(script);
    } else {
      loadJitsi();
    }
  }, [roomName]);

  const sendInvites = async () => {
    const emailList = emails.split(",").map((e) => e.trim()).filter(Boolean);
    if (emailList.length === 0) {
      alert("Please enter at least one valid email address.");
      return;
    }

    setIsSending(true);
    try {
      for (const email of emailList) {
        const url = new URL("https://melodic-holies-jamey.ngrok-free.dev/api/send-email");
        url.searchParams.append("recipient_email", email);
        url.searchParams.append("user_name", displayName);
        url.searchParams.append(
          "body_message",
          `You are invited to join a meeting.\n\nJoin here: ${meetingLink}`
        );

        const res = await fetch(url.toString(), { method: "POST" });
        if (!res.ok) throw new Error(`Failed to send invite to ${email}`);
      }

      alert("Invites sent successfully!");
      setEmails("");
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Error sending invites.");
    } finally {
      setIsSending(false);
    }
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(meetingLink);
    alert("🔗 Meeting link copied to clipboard!");
  };

  return (
    <div className="relative w-full h-screen bg-black">
      <div ref={jitsiContainer} className="w-full h-full" />

      <div className="absolute top-4 right-4 flex gap-3">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          Invite Members
        </button>
        <button
          onClick={copyLink}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-700 transition"
        >
          Copy Link
        </button>
      </div>

      {showModal && (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Invite Members</h2>
            <textarea
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              placeholder="Enter emails separated by commas"
              className="w-full border rounded-lg p-2 h-24 resize-none"
            />
            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={sendInvites}
                disabled={isSending}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                {isSending ? "Sending..." : "Send Invites"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
