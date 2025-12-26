"use client";
import { useRef } from "react";

export const useNotificationSound = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const unlockAudio = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/sounds/notifications.wav");
      audioRef.current.loop = true; // loop continuously
    }
    audioRef.current.play().catch(() => console.log("Audio blocked"));
  };

  const play = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => console.log("Audio blocked"));
  };

  const stop = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  return { unlockAudio, play, stop };
};
