"use client";
import { StaffRole } from "@/lib/types/staff-types";
import React from "react";

interface RoleBadgeProps {
  role: StaffRole;
}

export const RoleBadge = ({ role }: RoleBadgeProps) => {
  let bgColor = "";
  switch (role) {
    // case "owner":
    //   bgColor =
    //     "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
    //   break;
    case "staff":
      bgColor = "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100";
      break;
    case "kitchen":
      bgColor =
        "bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100";
      break;
    case "customer":
      bgColor = "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
      break;
    default:
      bgColor = "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
  }

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor}`}>
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  );
};
