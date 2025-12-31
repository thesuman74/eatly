"use client";

import * as React from "react";
import { ChevronsUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useRestaurantStore } from "@/stores/admin/restaurantStore";

export function RestaurantsSwitcher({
  restaurants,
}: {
  restaurants: { id: string; name: string; logo_url: string }[];
}) {
  const { isMobile } = useSidebar();
  const { restaurantId, setRestaurant } = useRestaurantStore();

  const hydrated = useRestaurantStore?.persist?.hasHydrated();

  console.log("restaurants infromation ", restaurants);

  console.log("hydraions tatus", hydrated);

  const activeRestaurant = restaurants.find((r) => r.id === restaurantId);

  console.log("activeRestaurant", activeRestaurant);

  if (!activeRestaurant) return null; // or a loader
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                {activeRestaurant.logo_url && (
                  <img
                    src={activeRestaurant.logo_url}
                    alt=""
                    className="size-8 rounded-full"
                  />
                )}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeRestaurant.name}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Restaurants
            </DropdownMenuLabel>

            {restaurants.map((item) => (
              <DropdownMenuItem
                key={item.id}
                onClick={() => setRestaurant(item.id, item.name)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  {item.logo_url && (
                    <img
                      src={item.logo_url}
                      alt=""
                      className="size-6 rounded-full"
                    />
                  )}
                </div>
                {item.name}
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
