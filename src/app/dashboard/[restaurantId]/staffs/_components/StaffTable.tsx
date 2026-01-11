"use client";
import React from "react";

import { Button } from "@/components/ui/button";
import { STAFFROLES, StaffTypes } from "@/lib/types/staff-types";
import { RoleBadge } from "./RoleBadge";

interface StaffTableProps {
  users: StaffTypes[];
}

export const StaffTable = ({ users }: StaffTableProps) => {
  return (
    <table className="w-full border-collapse border  ">
      <thead>
        <tr className="bg-secondary">
          <th className="border p-2 text-left">Name</th>
          <th className="border p-2 text-left">Email</th>
          <th className="border p-2 text-left">Phone</th>
          <th className="border p-2 text-left">Role</th>
          <th className="border p-2 text-left">Status</th>
          <th className="border p-2 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {users?.map((user) => (
          <tr key={user.id}>
            <td className="border p-2">{user.full_name}</td>
            <td className="border p-2">{user.email}</td>
            <td className="border p-2">{user.phone}</td>
            <td className="border p-2">{user.role}</td>
            <td className="border p-2">{user.role}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
