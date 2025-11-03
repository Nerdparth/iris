"use client";

export default function JoinButton() {
  const startMeeting = () => {
    const roomName = `meeting-${crypto.randomUUID()}`;
    window.open(`/meet/${roomName}?host=true`, "_blank");
  };

  return (
    <button
      onClick={startMeeting}
      className="bg-blue-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-700"
    >
      Start Meeting
    </button>
  );
}
