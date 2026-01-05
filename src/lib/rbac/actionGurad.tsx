// src/components/common/ActionGuard.tsx
"use client";
import React from "react";
import { Permission } from "@/lib/rbac/permission";
import { can } from "@/lib/rbac/can";
import { useUserStore } from "@/stores/admin/useUserStore";

interface ActionGuardProps {
  action: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  resourceOwnerId?: string;
}

export const ActionGuard: React.FC<ActionGuardProps> = ({
  action,
  children,
  fallback = null,
  resourceOwnerId,
}) => {
  const { user, loading } = useUserStore();

  if (loading) return null; // optionally show spinner
  if (!user) return <>{fallback}</>;

  const allowed = can({
    role: user.role,
    permission: action,
    context: { currentUserId: user.id, resourceOwnerId, role: user.role },
  });

  return allowed ? <>{children}</> : <>{fallback}</>;
};
