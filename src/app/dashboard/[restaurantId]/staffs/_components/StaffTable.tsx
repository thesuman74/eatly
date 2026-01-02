"use client";
import React from "react";

import { Button } from "@/components/ui/button";
import { StaffTypes } from "@/lib/types/staff-types";
import { RoleBadge } from "./RoleBadge";

interface StaffTableProps {
  users: StaffTypes[];
  onManageProfile: (user: StaffTypes) => void;
}

export const StaffTable = ({ users, onManageProfile }: StaffTableProps) => {
  return (
    <table className="w-full border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
      <thead className="bg-neutral-100 dark:bg-neutral-800">
        <tr>
          <th className="p-3 text-left">Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr
            key={user.id}
            className="border-t border-neutral-200 dark:border-neutral-700"
          >
            <td className="p-3">{user.full_name}</td>
            <td>{user.email}</td>
            <td className="text-center">
              <RoleBadge role={user.role} />
            </td>
            <td className="text-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onManageProfile(user)}
              >
                Manage Profile
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
