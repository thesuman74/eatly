"use client";

import { useState } from "react";
import { Button } from "./ui/button";

interface ImageFetcherProps {
  productName: string; // Product name to fetch
  onImageFetched?: (url: string) => void; // Callback when image is fetched
  buttonText?: string; // Optional button text
  className?: string; // Optional styling for button wrapper
}

const ImageFetcherButton: React.FC<ImageFetcherProps> = ({
  productName,
  onImageFetched,
  buttonText = "Get Image",
  className = "",
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchImage = async () => {
    if (!productName) {
      setError("Product name is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/menu/images/${encodeURIComponent(productName.toLowerCase())}`,
      );
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to fetch image");
        setLoading(false);
        return;
      }

      const imageUrl = data?.data?.image;
      if (!imageUrl) {
        setError("No image returned");
        setLoading(false);
        return;
      }

      // Call callback if provided
      if (onImageFetched) {
        onImageFetched(imageUrl);
      }

      setLoading(false);
    } catch (err) {
      setError("Network error");
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <Button
        variant={"outline"}
        type="button"
        onClick={fetchImage}
        disabled={loading}
      >
        {loading ? "Fetching..." : buttonText}
      </Button>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default ImageFetcherButton;
