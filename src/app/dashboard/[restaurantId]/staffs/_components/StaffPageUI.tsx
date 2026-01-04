"use client";

import { useStaffActions } from "@/hooks/users/useStaffActions";
import { StaffRole, STAFFROLES, StaffTypes } from "@/lib/types/staff-types";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { InviteStaffForm } from "./InviteStaffForm";
import { StaffTable } from "./StaffTable";

// Sample constant data
const staffData = [
  {
    id: "1",
    full_name: "Suman Adhikari",
    email: "suman@example.com",
    phone: "9800000000",
    role: STAFFROLES.OWNER,
    status: "active",
  },
  {
    id: "2",
    full_name: "John Doe",
    email: "john@example.com",
    phone: "9811111111",
    role: STAFFROLES.STAFF,
    status: "pending",
  },
];

const pendingInvites = [
  {
    id: "101",
    email: "newstaff@example.com",
    role: "Staff",
    status: "pending",
  },
];

interface StaffPageUIProps {
  staffData: StaffTypes[];
  // pendingInvites: any[];
}

export default function StaffPageUI({ staffData }: StaffPageUIProps) {
  // const [users, setUsers] = useState(staffData);
  const [invites, setInvites] = useState(pendingInvites);

  const { inviteStaff } = useStaffActions();

  const handleInviteUser = async (email: string, role: StaffRole) => {
    if (!email || !role) {
      return toast.error("Please provide both email and role.");
    }

    try {
      await inviteStaff.mutateAsync({ email, role });
    } catch (error) {}
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage My Team</h2>

      {/* Invite Section */}

      <InviteStaffForm
        onSubmit={handleInviteUser}
        isLoading={inviteStaff.isPending}
      />

      {/* Staff Table */}
      <div className="mb-6 bg-white p-2">
        <h3 className="font-semibold mb-2">Staff & Owner</h3>
        <StaffTable users={staffData} />
      </div>

      {/* Pending Invites */}
      <div className="bg-white p-2">
        <h3 className="font-semibold mb-2">Pending Invites</h3>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Email</th>
              <th className="border p-2 text-left">Role</th>
              <th className="border p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {invites.map((invite) => (
              <tr key={invite.id}>
                <td className="border p-2">{invite.email}</td>
                <td className="border p-2">{invite.role}</td>
                <td className="border p-2">{invite.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
