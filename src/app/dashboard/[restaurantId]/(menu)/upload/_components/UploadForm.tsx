"use client";

import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";
import PreviewMenuForm from "./ReviewExtractedMenu";
import { ProductCategoryTypes } from "@/lib/types/menu-types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "react-toastify";

export default function UploadForm() {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [reviewMenu, setReviewMenu] = useState(false);
  const [reviewMenuData, setReviewMenuData] = useState<ProductCategoryTypes[]>(
    []
  );

  // 🚀 Load saved extracted menu from localStorage
  useEffect(() => {
    const savedMenu = localStorage.getItem("extracted_menu");

    if (savedMenu) {
      setReviewMenuData(JSON.parse(savedMenu));
      setReviewMenu(true); // directly open review page
    }
  }, [previews]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = [...files, ...acceptedFiles].slice(0, 5); // limit 5
      setFiles(newFiles);

      // 🧹 Important: If user uploads a new image, clear old saved menu
      localStorage.removeItem("extracted_menu");
    },
    [files]
  );
  useEffect(() => {
    previews.forEach((url) => URL.revokeObjectURL(url));
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);

    return () => newPreviews.forEach((url) => URL.revokeObjectURL(url));
  }, [files]);

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("image", files[0]); // single image for now

    const res = await fetch("/api/gemini", { method: "POST", body: formData });
    const data = await res.json();

    setReviewMenuData(data.data);

    // 📝 save extracted menu to localStorage
    localStorage.setItem("extracted_menu", JSON.stringify(data.data));

    setLoading(false);
    setReviewMenu(true);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 5,
  });

  return (
    <>
      {reviewMenu ? (
        <PreviewMenuForm
          reviewMenu={reviewMenu}
          setReviewMenu={setReviewMenu}
          reviewMenuData={reviewMenuData}
          setReviewMenuData={setReviewMenuData}
        />
      ) : (
        <Card className="max-w-6xl mx-auto mt-10 p-6 border rounded-lg shadow bg-white relative">
          <CardHeader className="text-center mb-6">
            <h1 className="text-3xl font-bold">Upload Menu Image</h1>
            <p className="text-gray-600 mt-1">
              Drag & drop images here or click to select (max 5)
            </p>
          </CardHeader>

          {/* Loader Overlay */}
          {loading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70">
              <Loader2 className="animate-spin text-blue-500" size={64} />
            </div>
          )}

          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={`border-2  mx-auto max-w-2xl h-60 border-dashed rounded-xl p-8 text-center cursor-pointer transition 
              ${
                isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
              }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col  items-center justify-center">
              <img
                src="/images/uploadplaceholder.png"
                alt="Upload placeholder"
                className="w-24 h-24 opacity-50 mb-4"
              />
              <p className="text-gray-600">
                {isDragActive
                  ? "Drop the images here..."
                  : "Drag & drop menu images here, or click to select"}
              </p>
            </div>
          </div>

          {/* Preview grid */}
          {previews.length > 0 && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {previews.map((src, idx) => (
                <Card
                  key={src}
                  className="relative overflow-hidden rounded-md shadow"
                >
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
                    <X size={14} />
                  </button>
                </Card>
              ))}
            </div>
          )}

          {/* Upload Button */}
          <div className="mt-8 flex justify-center">
            <Button
              onClick={handleUpload}
              disabled={files.length === 0 || loading}
              className="px-6 py-3 text-white text-lg"
            >
              {loading ? "Extracting..." : "Extract Menu"}
            </Button>
          </div>
        </Card>
      )}
    </>
  );
}
