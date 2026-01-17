export const UserRoles = {
  OWNER: "owner",
  STAFF: "staff",
  KITCHEN: "kitchen",
  CUSTOMER: "customer",
  MANAGER: "manager",
} as const;

export type UserRoleTypes = (typeof UserRoles)[keyof typeof UserRoles];
