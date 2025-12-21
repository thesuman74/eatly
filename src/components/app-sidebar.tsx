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

// console.log("restaurantData", restaurantData);

// This is sample data.
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
      url: "/dashboard/order",
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
          url: "/dashboard/products",
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
          url: "#",
        },
        {
          title: "Statics",
          url: "#",
        },
      ],
    },

    {
      title: "Kitchen",
      url: "#",
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
      url: "#",
      icon: Bot,
    },
    {
      name: "Customers",
      url: "#",
      icon: Users,
    },
  ],
};
type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  restaurants: Array<{
    id: string;
    name: string;
    logo: string;
  }>;
};

export function AppSidebar({ restaurants, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <RestaurantsSwitcher restaurants={restaurants} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
