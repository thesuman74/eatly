import { StaffRole, StaffTypes } from "@/lib/types/staff-types";
import { addStaffAPI, getStaffsAPI } from "@/services/staffServices";
import { useRestaurantStore } from "@/stores/admin/restaurantStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export function useStaffActions() {
  const queryClient = useQueryClient();
  const restaurantId = useRestaurantStore((state) => state.restaurantId);

  const getStaffs = useQuery({
    queryKey: ["Staffs", restaurantId],
    queryFn: () => getStaffsAPI(restaurantId),
    enabled: !!restaurantId,
    retry: false,
  });

  const getStaffsInvite = useQuery({
    queryKey: ["StaffsInvite", restaurantId],
    queryFn: async () => {
      const res = await fetch(
        `/api/staffs/invite?restaurantId=${restaurantId}&inviteStatus=pending`
      );
      return await res.json();
    },
    enabled: !!restaurantId,
  });

  // Invite staff (magic link)
  const inviteStaff = useMutation({
    mutationFn: async ({ email, role }: { email: string; role: StaffRole }) => {
      const res = await fetch("/api/staffs/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role, restaurantId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to send invite");
      }

      return res.json();
    },
    onSuccess: () => {
      // Invalidate staff list so it refreshes after invite
      queryClient.invalidateQueries({ queryKey: ["Staffs", restaurantId] });

      // Invalidate invite list so it refreshes after invite
      queryClient.invalidateQueries({
        queryKey: ["StaffsInvite", restaurantId],
      });

      toast.success("Invite sent successfully!");
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to send invite");
    },
  });

  const addStaff = useMutation({
    mutationFn: async (StaffData: StaffTypes) => {
      return await addStaffAPI(StaffData, restaurantId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Staffs", restaurantId] });
      toast.success("Staff added successfully!");
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to add Staff");
    },
  });

  const updateStaff = useMutation({
    mutationFn: async () => {},
    onSuccess: () => {},
    onError: () => {},
  });

  const deleteStaff = useMutation({
    mutationFn: async () => {},
    onSuccess: () => {},
    onError: () => {},
  });

  return { getStaffs, getStaffsInvite, inviteStaff, updateStaff, deleteStaff };
}
