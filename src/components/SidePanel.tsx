"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  width?: string;
}

export default function SidePanel({
  isOpen,
  onClose,
  children,
  width = "w-[890px]",
}: SidePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(isOpen);

  // Animate open/close
  useEffect(() => {
    if (isOpen) setVisible(true);
    else {
      const timer = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (isOpen && panelRef.current && !panelRef.current.contains(target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!visible) return null;

  return (
    <div
      ref={panelRef}
      className={`
        ${width} bg-white border-r shadow-lg h-full top-0 right-[384px]
        fixed flex flex-col
        transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "translate-x-full"}
      `}
    >
      {children}
    </div>
  );
}
