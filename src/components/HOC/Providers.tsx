"use client";

import React, { ReactNode } from "react";
import { ThemeProvider } from "./theme-provider";
import ToastProvider from "./ToastProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CounterStoreProvider } from "./ProductCartProvider";

const Provider = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <CounterStoreProvider>{children}</CounterStoreProvider>
      </ToastProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default Provider;
