import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { updateOrderStatusAPI } from "@/services/orderServices";
import { useUpdateOrderStatus } from "@/hooks/order/useOrders";

// ---- mocks ----
vi.mock("@/lib/api/orders", () => ({
  updateOrderStatusAPI: vi.fn(),
}));

vi.mock("@/stores/restaurantStore", () => ({
  useRestaurantStore: vi.fn(() => ({
    restaurantId: "restaurant-1",
  })),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useUpdateOrderStatus", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("updates order status successfully", async () => {
    (updateOrderStatusAPI as any).mockResolvedValue({});

    const { result } = renderHook(() => useUpdateOrderStatus(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate({
        id: "order-1",
        status: "CANCELLED",
      });
    });

    await waitFor(() => {
      expect(updateOrderStatusAPI).toHaveBeenCalledWith({
        id: "order-1",
        status: "CANCELLED",
        restaurantId: "restaurant-1",
      });
    });
  });

  it("throws error when restaurantId is missing", async () => {
    vi.mocked(
      await import("@/stores/restaurantStore")
    ).useRestaurantStore.mockReturnValueOnce({
      restaurantId: null,
    } as any);

    const { result } = renderHook(() => useUpdateOrderStatus(), {
      wrapper: createWrapper(),
    });

    expect(() =>
      result.current.mutate({
        id: "order-1",
        status: "CANCELLED",
      })
    ).toThrow();
  });

  it("handles API error gracefully", async () => {
    (updateOrderStatusAPI as any).mockRejectedValue(new Error("Update failed"));

    const { result } = renderHook(() => useUpdateOrderStatus(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate({
        id: "order-1",
        status: "CONFIRMED",
      });
    });

    await waitFor(() => {
      expect(updateOrderStatusAPI).toHaveBeenCalled();
    });
  });
});
