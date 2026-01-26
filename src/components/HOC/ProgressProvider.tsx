"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface ProgressProviderProps {
  children: React.ReactNode;
}

const ProgressProvider = ({ children }: ProgressProviderProps) => {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    // Start loading
    setLoading(true);
    setWidth(0);

    // Animate bar from 0 → 100% over 500ms
    const animation = setTimeout(() => {
      setWidth(100);
    }, 50); // slight delay so transition works

    // Hide bar after animation
    const finish = setTimeout(() => {
      setLoading(false);
      setWidth(0);
    }, 600);

    // Cleanup
    return () => {
      clearTimeout(animation);
      clearTimeout(finish);
      setLoading(false);
      setWidth(0);
    };
  }, [pathname]);

  return (
    <>
      {children}
      {loading && (
        <div className="fixed top-0 left-0 z-[9999] h-1 w-full bg-gray-100">
          <div
            className="h-full bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-500 ease-linear"
            style={{ width: `${width}%` }}
          />
        </div>
      )}
    </>
  );
};

export default ProgressProvider;
