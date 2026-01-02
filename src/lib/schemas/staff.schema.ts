import { z } from "zod";
import { STAFFROLES } from "../types/staff-types";

export const createStaffSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),

  email: z.string().email("Invalid email address"),

  phone: z.string().min(7, "Phone number is too short").optional(),

  password: z.string().min(6, "Password must be at least 6 characters"),

  role: z.enum(STAFFROLES),
});

export type CreateStaffInput = z.infer<typeof createStaffSchema>;
