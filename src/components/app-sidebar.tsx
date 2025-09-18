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
  Users,
  Utensils,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Digital Menus",
      logo: GalleryVerticalEnd,
      plan: "",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
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
          url: "products",
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
