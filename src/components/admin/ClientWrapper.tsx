// src/app/admin/ClientWrapper.tsx
"use client";

import { useUserStore } from "@/stores/admin/useUserStore";
import React, { useEffect } from "react";

const ClientWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const fetchUser = useUserStore((state) => state.fetchUser);

  useEffect(() => {
    fetchUser(); // fetch user info on client
  }, [fetchUser]);

  return <>{children}</>;
};

export default ClientWrapper;
