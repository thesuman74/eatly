"use client";
import { useRef, useEffect, useCallback } from "react";

export const useNotificationSound = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isUnlockedRef = useRef(false);
  const isPlayingRef = useRef(false);

  // Initialize audio on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio("/sounds/notifications.wav");
      audioRef.current.loop = true;
      audioRef.current.preload = "auto";
      audioRef.current.volume = 0.5;

      console.log(
        "  Audio initialized with source:",
        "/sounds/notifications.wav"
      );
    }

    const unlockOnInteraction = () => {
      if (!isUnlockedRef.current) {
        isUnlockedRef.current = true;
        console.log("  Audio unlocked via user interaction");
      }
    };

    // Add listeners to common user interactions
    const events = ["click", "touchstart", "keydown"];
    events.forEach((event) => {
      document.addEventListener(event, unlockOnInteraction, { once: true });
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, unlockOnInteraction);
      });
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const play = useCallback(() => {
    if (!audioRef.current) {
      console.log("  Audio element not initialized");
      return false;
    }

    if (isPlayingRef.current) {
      console.log("  Audio already playing");
      return true;
    }

    try {
      audioRef.current.currentTime = 0;
      const playPromise = audioRef.current.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            isPlayingRef.current = true;
            console.log("  Audio playing successfully");
          })
          .catch((error) => {
            console.log("  Audio play blocked:", error.message);
            isPlayingRef.current = false;
          });
      }
      return true;
    } catch (error) {
      console.log(" Audio play error:", error);
      return false;
    }
  }, []);

  const stop = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    isPlayingRef.current = false;
    console.log("  Audio stopped");
  }, []);

  return { play, stop, isUnlocked: isUnlockedRef.current };
};
