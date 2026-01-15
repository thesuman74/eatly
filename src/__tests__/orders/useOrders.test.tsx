import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { getOrderListAPI } from "@/services/orderServices";
import { useOrders } from "@/hooks/order/useOrders";

// ---- mocks ----
vi.mock("@/lib/api/orders", () => ({
  getOrderListAPI: vi.fn(),
}));

vi.mock("@/stores/restaurantStore", () => ({
  useRestaurantStore: vi.fn(() => ({
    restaurantId: "restaurant-1",
  })),
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
    vi.resetAllMocks();
  });

  it("fetches orders when restaurantId exists", async () => {
    (getOrderListAPI as any).mockResolvedValue([
      { id: "order-1", status: "PENDING" },
    ]);

    const { result } = renderHook(() => useOrders(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(getOrderListAPI).toHaveBeenCalledWith("restaurant-1");
    expect(result.current.data).toHaveLength(1);
  });

  it("does not fetch when restaurantId is missing", async () => {
    vi.mocked(
      await import("@/stores/restaurantStore")
    ).useRestaurantStore.mockReturnValueOnce({
      restaurantId: null,
    } as any);

    const { result } = renderHook(() => useOrders(), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe("idle");
    expect(getOrderListAPI).not.toHaveBeenCalled();
  });
});
