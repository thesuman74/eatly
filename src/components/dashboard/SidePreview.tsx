"use client";
import { X } from "lucide-react";
import React, { useState } from "react";

interface SidePreviewProps {
  src: string;
  showSidePreview?: boolean;
}

const SidePreview = ({ src, showSidePreview }: SidePreviewProps) => {
  const [SidePreview, setSidePreview] = useState(showSidePreview || false);
  return (
    <>
      {SidePreview && (
        <>
          <div className="bg-gray-200  h-screen flex-none md:w-96 justify-center  flex overflow-x-hidden  ">
            <iframe
              src="/menu"
              className="w-[330px] h-[600px] border rounded-xl mt-10 shadow-lg relative"
            ></iframe>
          </div>
          <div className="flex absolute top-20 right-0 cursor-pointer ">
            <span>
              <X onClick={() => setSidePreview(!SidePreview)} />
            </span>
          </div>
        </>
      )}
    </>
  );
};

export default SidePreview;
