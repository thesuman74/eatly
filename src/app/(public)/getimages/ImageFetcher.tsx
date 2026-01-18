"use client";

import { useState } from "react";

const ImageFetcher: React.FC = () => {
  const [productName, setProductName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchImage = async () => {
    if (!productName) return;

    setLoading(true);
    setError("");
    setImageUrl("");

    const response = await fetch(
      `/api/menu/images/${encodeURIComponent(productName.toLowerCase())}`,
    );

    const data = await response.json();
    console.log("data", data);

    if (response.ok) {
      setImageUrl(data.image);
    } else {
      setError(data.error || "Something went wrong");
    }

    setLoading(false);
  };

  console.log("imageUrl", imageUrl);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 flex flex-col items-center gap-4">
        <h1 className="text-xl font-semibold">Menu Image Finder</h1>

        <input
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="Enter product name (e.g. momo)"
        />

        <button
          onClick={fetchImage}
          disabled={loading}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Fetching..." : "Get Image"}
        </button>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {imageUrl && (
          <div className="mt-4 w-full">
            <img
              src={imageUrl}
              alt="Product"
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageFetcher;
