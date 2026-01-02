"use client";
import React, { useState } from "react";
import { StaffTable } from "./_components/StaffTable";
import { CreateStaffModal } from "./_components/CreateStaffModal";
import { useStaffActions } from "@/hooks/users/useStaffActions";
import { StaffRole } from "@/lib/types/staff-types";
import {
  CreateStaffInput,
  createStaffSchema,
} from "@/lib/schemas/staff.schema";
import { InviteStaffForm } from "./_components/InviteStaffForm";
import { email } from "zod";
import { toast } from "react-toastify";

export default function StaffPage() {
  const { getStaffs } = useStaffActions();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { inviteStaff } = useStaffActions();

  const handleInvite = (email: string, role: StaffRole) => {
    if (!email || !role) {
      toast.error("Email and role required");
    }

    inviteStaff.mutate({ email, role });
  };
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage My Team</h2>
      <button
        className="btn btn-primary mb-4"
        onClick={() => setIsModalOpen(true)}
      >
        + Add User
      </button>
      {getStaffs.isLoading && <p>Loading...</p>}
      {getStaffs.data && (
        <StaffTable
          users={getStaffs.data}
          onManageProfile={(user) => console.log(user)}
        />
      )}
      {/* {isModalOpen && (
        <CreateStaffModal
          isLoading={addStaff.isPending}
          isOpen={true}
          onSubmit={handleCreateStaff}
          onClose={() => setIsModalOpen(false)}
        />
      )} */}
      <InviteStaffForm onSubmit={handleInvite} />
    </div>
  );
}
