"use client"; // Mark this file or component as a client component

import { Share2 } from "lucide-react"; // Example icon
import { Button } from "@/components/ui/button"; // Adjust the import path based on your setup

export default function ShareButton() {
  return (
    <Button
      variant="outline"
      className="border-none font-bold"
      size="icon"
      onClick={async () => {
        if (navigator.share) {
          try {
            await navigator.share({
              title: "Kaji Chiya Menu",
              url: window.location.href,
            });
          } catch (error) {
            console.error("Error sharing:", error);
          }
        } else {
          alert("Sharing is not supported in this browser.");
        }
      }}
    >
      <Share2 size={28} />
    </Button>
  );
}
