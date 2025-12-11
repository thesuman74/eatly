"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { PlusCircle } from "lucide-react";

type FileUploaderProps = {
  files?: File[];
  onChange: (files: File[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  imageResolution?: { width: number; height: number };
  previewClassName?: string;
};

export const FileUploader = ({
  files: externalFiles = [],
  onChange,
  multiple = true,
  maxFiles = 5,
  imageResolution,
  previewClassName = "",
}: FileUploaderProps) => {
  const [files, setFiles] = useState<File[]>(externalFiles);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Sync internal state with external files
  useEffect(() => {
    setFiles(externalFiles);
  }, [externalFiles]);

  // Generate previews for ONLY the newly uploaded files
  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (multiple) {
        const newFiles = [...files, ...acceptedFiles].slice(0, maxFiles);
        setFiles(newFiles);
        onChange(newFiles);
      } else {
        const newFile = [acceptedFiles[0]];
        setFiles(newFile);
        onChange(newFile);
      }
    },
    [files, multiple, maxFiles, onChange]
  );

  const removeFile = (index: number) => {
    const updated = [...files];
    updated.splice(index, 1);
    setFiles(updated);
    onChange(updated);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple,
    maxFiles,
    accept: { "image/*": [] },
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const width = imageResolution?.width || 100;
  const height = imageResolution?.height || 100;

  return (
    <div className="flex items-start gap-4 flex-wrap">
      {/* Upload Section */}
      {((multiple && previewUrls.length < maxFiles) ||
        previewUrls.length === 0) && (
        <div
          {...getRootProps()}
          className="border-2 border-dashed border-blue-400 rounded-lg flex items-center justify-center cursor-pointer bg-background hover:border-blue-400 hover:bg-gray-50 transition"
          style={{ width, height }}
        >
          <input {...getInputProps()} />
          <div className="text-center">
            <PlusCircle className="w-8 h-8 text-blue-400 mx-auto" />
            <p className="text-xs text-gray-500 mt-2">
              <span className="text-blue-500">Click to upload</span> or drag &
              drop
            </p>
          </div>
        </div>
      )}

      {/* Preview Section */}
      <div className="flex flex-wrap gap-4">
        {previewUrls.map((preview, index) => (
          <div
            key={index}
            className={`relative bg-gray-50 shadow`}
            style={{ width, height }}
          >
            <img
              src={preview}
              className={`w-full h-full rounded-lg object-cover ${previewClassName}`}
              alt="preview"
            />

            <button
              onClick={() => removeFile(index)}
              className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Example scenarios
// WITH REACT HOOK FORM
// 1. . Manually Handling setValue and getValues from reactForm

{
  /* <FileUploader
  files={form.getValues("images")} // Pass current field value
  onChange={(files) => form.setValue("images", files)} // Update field value
/> */
}

// 2. using a controller
// <Controller
//   name="images"
//   control={form.control}
//   render={({ field }) => (
//     <FileUploader
//       files={field.value} // Sync files with form state
//       onChange={field.onChange} // Update form state on change
//     />
//   )}
// />

// WIHOUT REACT HOOK FORM
// const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

// return (
//   <FileUploader
//     files={uploadedFiles} // Pass the parent-managed state
//     onChange={setUploadedFiles} // Update parent state on change
//   />
// );
