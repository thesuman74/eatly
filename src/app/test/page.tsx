"use client";

export default function TestNotificationSound() {
  const playSound = () => {
    const audio = new Audio("/sounds/notifications.wav");
    audio.play().catch(() => {
      console.log("Audio playback blocked by browser");
    });
  };

  const stop = () => {
    const audio = new Audio("/sounds/notifications.wav");
    audio.pause();
    audio.currentTime = 0;
  };

  return (
    <>
      <button
        onClick={playSound}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Play Notification Sound
      </button>

      <button
        onClick={stop}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        stop Notification Sound
      </button>
    </>
  );
}
