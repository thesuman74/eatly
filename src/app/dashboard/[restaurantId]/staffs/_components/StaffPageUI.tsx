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
  return (
    <div className="p-4 bg-white">
      <h2 className="text-2xl font-bold mb-4"> My Team</h2>
      <StaffTable users={staffData} />
    </div>
  );
}
