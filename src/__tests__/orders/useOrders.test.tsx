import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { useOrders } from "@/hooks/order/useOrders";
import { getOrderListAPI } from "@/services/orderServices";
import { useRestaurantStore } from "@/stores/admin/restaurantStore";
import React from "react";

// ---- mocks ----
vi.mock("@/services/orderServices", () => ({
  getOrderListAPI: vi.fn(),
}));

vi.mock("@/stores/admin/restaurantStore", () => ({
  useRestaurantStore: vi.fn(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useOrders", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches orders when restaurantId exists", async () => {
    vi.mocked(useRestaurantStore).mockReturnValue({
      restaurantId: "restaurant-1",
    } as any);

    vi.mocked(getOrderListAPI).mockResolvedValue([
      { id: "order-1", status: "PENDING" },
    ] as any);

    const { result } = renderHook(() => useOrders(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(getOrderListAPI).toHaveBeenCalledWith({
      restaurantId: "restaurant-1",
    });

    expect(result.current.data).toHaveLength(1);
  });

  it("does not execute query when restaurantId is missing", () => {
    (useRestaurantStore as unknown as vi.Mock).mockReturnValue({
      restaurantId: null,
    });

    const { result } = renderHook(() => useOrders(), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe("idle");
    expect(result.current.data).toBeUndefined();
  });
});
