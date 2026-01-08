"use client";

import React, { ReactElement } from "react";
import { Permission } from "@/lib/rbac/permission";
import { can } from "@/lib/rbac/can";
import { useUserStore } from "@/stores/admin/useUserStore";

/*
 *this function handles 
 1. permission level check --> if the user has the permission to perform the action
 2. resource level check --> if user has permission for this rescource , for eg. owner/staff can only update their restaurant data 
3. Fallback behavior → either hides or disables the component if access is denied.

 */
type DisableableProps = {
  disabled?: boolean;
  readOnly?: boolean;
  onClick?: React.MouseEventHandler;
  className?: string;
};

interface ActionGuardProps {
  action: Permission;
  children: ReactElement<DisableableProps>; // 👈 critical
  fallback?: React.ReactNode;
  resourceOwnerId?: string;
  mode?: "hide" | "disable";
}

export const ActionGuard: React.FC<ActionGuardProps> = ({
  action,
  children,
  fallback = null,
  resourceOwnerId,
  mode = "hide",
}) => {
  const { user, loading } = useUserStore();

  if (loading) return null;
  if (!user) return <>{fallback}</>;

  const allowed = can({
    role: user.role,
    permission: action,
    context: {
      currentUserId: user.id,
      resourceOwnerId,
      role: user.role,
    },
  });

  if (allowed) {
    return children;
  }

  if (mode === "hide") {
    return <>{fallback}</>;
  }

  if (mode === "disable") {
    return React.cloneElement(children, {
      disabled: true,
      readOnly: true,
      onClick: undefined,
      className: `
        ${children.props.className ?? ""}
        pointer-events-none  cursor-not-allowed
      `,
    });
  }

  return null;
};

// usage sample
//  <ActionGuard action={Permission.UPDATE_RESTAURANT} mode="disable">
//                 <input
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   onBlur={handleNameBlur}
//                   className="text-xl md:text-3xl sm:text-4xl font-bold border-b border-gray-300 focus:outline-none"
//                 />
//               </ActionGuard>
