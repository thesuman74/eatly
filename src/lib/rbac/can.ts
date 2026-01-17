import { Permission } from "./permission";
import { UserRoles, UserRoleTypes } from "./roles";
import { ROLE_PERMISSIONS } from "./role-permissions";

interface CanParams {
  role: UserRoleTypes | null | undefined;
  permission: Permission;
  context?: {
    currentUserId: string;
    resourceOwnerId?: string;
    role?: string;
  };
}

export function can({ role, permission, context }: CanParams): boolean {
  if (!role) return false;

  const permissions = ROLE_PERMISSIONS[role];

  if (!permissions) return false;

  return permissions.includes(permission);
}
