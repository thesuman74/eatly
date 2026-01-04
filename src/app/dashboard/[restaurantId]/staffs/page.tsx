"use client";
import React from "react";
import StaffPageUI from "./_components/StaffPageUI";
import { useStaffActions } from "@/hooks/users/useStaffActions";

const page = () => {
  const { getStaffs } = useStaffActions();

  if (getStaffs.isLoading) return <div>Loading...</div>;
  if (getStaffs.isError) return <div>Error: {getStaffs.error?.message}</div>;

  const staffData = getStaffs?.data.users;

  return (
    <div>
      <StaffPageUI staffData={staffData} />
    </div>
  );
};

export default page;
