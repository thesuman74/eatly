"use client";

import { useRestaurantStore } from "@/stores/admin/restaurantStore";
import {
  ShoppingCart,
  DollarSign,
  Utensils,
  Menu,
  CookingPot,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/components/ui/sidebar";

export default function BottomNavbar() {
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();
  const restaurantName = useRestaurantStore((state) => state.restaurantName);

  const navItems = [
    {
      label: "Orders POS",
      href: `/dashboard/${restaurantName}/order`,
      icon: ShoppingCart,
    },

    {
      label: "Menu",
      href: `/dashboard/${restaurantName}/products`,
      icon: Utensils,
    },
    {
      label: "Kitchen",
      href: `/dashboard/${restaurantName}/kitchen`,
      icon: CookingPot,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 dark:bg-secondary bg-blue-600 md:hidden">
      <div className="flex h-16 items-center justify-around">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = href !== "#" && pathname.startsWith(href);

          return (
            <Link
              key={label}
              href={href}
              className={`flex flex-col items-center justify-center text-xs font-medium transition
                ${active ? "text-white" : "text-blue-100"}`}
            >
              <Icon size={22} />
              <span className="mt-1">{label}</span>
            </Link>
          );
        })}

        {/* MORE → OPEN SIDEBAR */}
        <button
          onClick={toggleSidebar}
          className="flex flex-col items-center justify-center text-xs font-medium text-blue-100 transition hover:text-white"
        >
          <Menu size={22} />
          <span className="mt-1">More</span>
        </button>
      </div>
    </nav>
  );
}
