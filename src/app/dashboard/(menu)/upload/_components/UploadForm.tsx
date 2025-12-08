"use client";

import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, MoveLeft, X } from "lucide-react";
import PreviewMenuForm from "./ReviewExtractedMenu";
import { ProductCategoryTypes } from "@/lib/types/menu-types";

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [reviewMenu, setReviewMenu] = useState(false);
  const [reviewMenuData, setReviewMenuData] = useState<ProductCategoryTypes[]>(
    []
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Combine existing and new files, limit to 5
      const newFiles = [...files, ...acceptedFiles].slice(0, 5);
      setFiles(newFiles);
    },
    [files]
  );

  // Generate preview URLs and revoke old ones
  useEffect(() => {
    previews.forEach((url) => URL.revokeObjectURL(url));

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);

    return () => {
      newPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const handleUpload = async () => {
    setLoading(true);
    if (files.length === 0) return;

    const formData = new FormData();
    formData.append("image", files[0]);

    // setTimeout(() => {
    //   setLoading(false);
    //   setReviewMenu(true);
    // }, 5000);

    const res = await fetch("/api/gemini", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setReviewMenuData(data.data);
    console.log("response  form upload page", data);
    setLoading(false);
    setReviewMenu(true);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  return (
    <>
      {reviewMenu ? (
        <PreviewMenuForm
          reviewMenu={reviewMenu}
          setReviewMenu={setReviewMenu}
          reviewMenuData={reviewMenuData}
        />
      ) : (
        <div className="max-w-5xl mx-auto mt-10 p-6 border rounded-lg shadow bg-white relative">
          <h1 className="text-2xl font-semibold mb-6 text-center">
            Upload Menu Image
          </h1>

          {/* Loader Overlay */}
          {loading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80">
              <Loader2 className="animate-spin text-blue-500" size={64} />
            </div>
          )}

          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
              isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
            }`}
          >
            <input {...getInputProps()} />
            <p className="text-gray-600">
              {isDragActive
                ? "Drop the images here..."
                : "Drag & drop menu images here, or click to select (max 5)"}
            </p>
            <div className="w-full justify-center items-center flex py-4">
              <img
                src="/images/uploadplaceholder.png"
                alt="Upload placeholder"
                height={100}
                width={100}
                className="opacity-50 bg-blue-500"
              />
            </div>
          </div>

          {/* Preview grid */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            {previews.map((src, idx) => (
              <Card key={src} className="relative overflow-hidden rounded-md">
                <img
                  src={src}
                  alt={`Preview ${idx + 1}`}
                  className="w-full h-40 object-cover"
                />
                <button
                  onClick={() => removeFile(idx)}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  aria-label="Remove image"
                  type="button"
                >
                  <X />
                </button>
              </Card>
            ))}
          </div>

          <div className="mt-6 flex justify-center">
            <Button
              onClick={handleUpload}
              disabled={files.length === 0 || loading}
              className="text-white"
            >
              {loading ? "Extracting..." : "Extract Menu"}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
