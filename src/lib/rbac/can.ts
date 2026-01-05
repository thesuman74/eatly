import { Permission } from "./permission";
import { UserRoles } from "./roles";
import { ROLE_PERMISSIONS } from "./role-permissions";

interface CanParams {
  role: UserRoles | null | undefined;
  permission: Permission;
}

export function can({ role, permission }: CanParams): boolean {
  if (!role) return false;

  const permissions = ROLE_PERMISSIONS[role];

  if (!permissions) return false;

  return permissions.includes(permission);
}
