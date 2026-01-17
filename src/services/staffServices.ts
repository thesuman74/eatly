import { StaffTypes } from "@/lib/types/staff-types";

// StaffServices.ts
export async function getStaffsAPI(restaurantId: string) {
  const res = await fetch(`/api/staffs?restaurantId=${restaurantId}`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to fetch Staffs");
  }

  return data;
}

export async function addStaffAPI(StaffData: StaffTypes, restaurantId: string) {
  const payload = {
    ...StaffData,
    restaurantId,
  };
  const res = await fetch(`/api/staffs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to add Staff");
  }

  return data;
}

export async function updateStaffAPI(StaffId: string, StaffData: StaffTypes) {
  const res = await fetch(`/api/staffs/${StaffId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(StaffData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to update Staff");
  }

  return data;
}

export async function getStaffsInviteAPI(restaurantId: string) {
  const res = await fetch(`/api/staffs/invite?restaurantId=${restaurantId}`);
  const data = await res.json();
  if (res.status === 403) {
    return []; // behave like "no invites"
  }

  if (!res.ok) {
    throw new Error(data.error || "Failed to fetch Staffs");
  }

  return data;
}

export async function getAvailableRolesAPI(restaurantId: string) {
  const res = await fetch(`/api/staffs/roles?restaurantId=${restaurantId}`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to fetch Staffs");
  }

  return data;
}
