"use client";

import React from "react";
import StaffPageUI from "./_components/StaffPageUI";
import { useStaffActions } from "@/hooks/users/useStaffActions";
import { StaffRole } from "@/lib/types/staff-types";
import { toast } from "react-toastify";
import { InviteStaffForm } from "./_components/InviteStaffForm";
import { Pen } from "lucide-react";
import PendingInvites from "./_components/InviteLists";
import InviteLists from "./_components/InviteLists";
import { ActionGuard } from "@/lib/rbac/actionGurad";
import { Permission } from "@/lib/rbac/permission";

const StaffPage = () => {
  const { getStaffs, inviteStaff, getStaffsInvite } = useStaffActions();

  const handleInviteUser = async (email: string, role: StaffRole) => {
    if (!email || !role) {
      return toast.error("Please provide both email and role.");
    }

    try {
      await inviteStaff.mutateAsync({ email, role });
    } catch (error: any) {}
  };

  const staffData = getStaffs?.data?.users || [];
  const staffInvites = getStaffsInvite?.data || [];

  console.log("staffInvites", staffInvites);

  {
    getStaffs.isError && (
      <div className="text-red-500">
        Error fetching staff list: {getStaffs.error?.message}
      </div>
    );
  }

  return (
    <div className="container space-y-4 max-w-5xl mx-auto p-4">
      {/* Invite Section */}
      <ActionGuard action={Permission.READ_STAFF_INVITE_INFO}>
        <InviteStaffForm
          onSubmit={handleInviteUser}
          isLoading={inviteStaff.isPending}
        />
      </ActionGuard>

      {/* Staff List */}
      <div className="mt-6">
        {getStaffs.isLoading ? (
          <div>Loading staff list...</div>
        ) : getStaffs.isError ? (
          <div className="text-red-500">Error: {getStaffs.error?.message}</div>
        ) : (
          <StaffPageUI staffData={staffData} />
        )}
      </div>
      <ActionGuard action={Permission.READ_STAFF_INVITE_INFO}>
        <InviteLists invites={staffInvites} />
      </ActionGuard>
    </div>
  );
};

export default StaffPage;
