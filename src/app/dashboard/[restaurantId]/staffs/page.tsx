"use client";
import React from "react";
import StaffPageUI from "./_components/StaffPageUI";
import { useStaffActions } from "@/hooks/users/useStaffActions";

const page = () => {
  const { getStaffs } = useStaffActions();

  if (getStaffs.isLoading) return <div>Loading...</div>;
  if (getStaffs.isError) return <div>Error: {getStaffs.error?.message}</div>;

  console.log("Staff data:", getStaffs.data);

  return (
    <div>
      <StaffPageUI />
    </div>
  );
};

export default page;
