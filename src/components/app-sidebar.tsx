"use client";

import * as React from "react";
import {
  AudioWaveform,
  Bot,
  CircleDollarSign,
  Command,
  CookingPot,
  GalleryVerticalEnd,
  ListOrdered,
  NotebookPen,
  SquareArrowOutUpRight,
  Store,
  Users,
  Utensils,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { RestaurantsSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useRestaurantStore } from "@/stores/admin/restaurantStore";
import Link from "next/link";

// This is sample data.
type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  restaurants: Array<{
    id: string;
    name: string;
    logo_url: string;
  }>;
};

export function AppSidebar({ restaurants, ...props }: AppSidebarProps) {
  const restaurantId = useRestaurantStore((state) => state.restaurantId);
  const restaurantName = useRestaurantStore((state) => state.restaurantName);

  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    // resturants: restaurantData.map((restaurant) => ({
    //   name: restaurant.name,
    //   logo: Store,
    //   plan: "Free",
    // })),
    navMain: [
      {
        title: "Order Pos",
        // url: "/dashboard/order",
        url: `/dashboard/${restaurantName}/order`,
        icon: NotebookPen,
        isActive: true,
      },
      {
        title: "Menus",
        url: "#",
        icon: Utensils,
        items: [
          {
            title: "Product Page",
            url: `/dashboard/${restaurantName}/products`,
            // url: "/dashboard/products",
          },
          {
            title: "Welcome Page",
            url: "#",
          },
          {
            title: "Ordering Settings",
            url: "#",
          },
        ],
      },
      {
        title: "Sales",
        url: "#",
        icon: CircleDollarSign,
        isActive: true,
        items: [
          {
            title: "Order History",
            url: "/dashboard/orders",
          },
          {
            title: "Statics",
            url: "#",
          },
        ],
      },

      {
        title: "Kitchen",
        url: `/dashboard/${restaurantName}/kitchen`,
        icon: CookingPot,
      },
      {
        title: "Stocks",
        url: "#",
        icon: ListOrdered,
      },
    ],
    projects: [
      {
        name: "Employees",
        url: `/dashboard/${restaurantName}/staffs`,
        icon: Bot,
      },
      {
        name: "Customers",
        url: "#",
        icon: Users,
      },
    ],
  };
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <RestaurantsSwitcher restaurants={restaurants} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <div className="mx-auto flex space-x-3 group-data-[collapsible=icon]:border-none border  py-2 px-4 rounded-sm hover:scale-125 duration-200 hover:cursor-pointer">
        <Link href={`/${restaurantId}`} className="flex space-x-4">
          <SquareArrowOutUpRight />{" "}
          <span className="hidden sm:block group-data-[collapsible=icon]:hidden ">
            Preview
          </span>
        </Link>
      </div>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
