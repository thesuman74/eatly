import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MdOutlineDeliveryDining } from "react-icons/md";
import { MdOutlineTableBar } from "react-icons/md";
import { GoChecklist } from "react-icons/go";
import { RefreshCcw, Search } from "lucide-react";
import NewOrderDropdown from "@/app/dashboard/[restaurantId]/order/_components/NewOrderDropdown";
import CounterTable from "./CounterTable";
import FeatureComingSoon from "../FeatureCommingSoon";

const OrderTabsSection = () => {
  const tablist = [
    {
      id: 1,
      title: "Counter",
      icon: <GoChecklist />,
      count: 1,
      content: <CounterTable />,
    },
    {
      id: 2,
      title: "Delivery",
      icon: <MdOutlineDeliveryDining />,
      count: 1,
      content: <FeatureComingSoon />,
    },
    {
      id: 3,
      title: "Tables",
      icon: <MdOutlineTableBar />,
      count: 1,
      content: <FeatureComingSoon />,
    },
  ];

  return (
    <Tabs defaultValue="Counter" className="w-full mt-2 px-2 md:px-4">
      <div className="flex flex-wrap md:flex-row md:justify-between gap-2 md:gap-0">
        <TabsList className="flex h-auto gap-0 md:gap-1 md:overflow-hidden md:grid md:grid-cols-3 p-0 no-scrollbar">
          {tablist.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.title}
              className="flex-shrink-0 border-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-500"
            >
              <div className="flex flex-col items-center sm:flex-row sm:items-center sm:space-x-1 px-2 sm:px-2 py-1 sm:py-2 bg-background font-bold min-w-[80px] sm:min-w-[120px]">
                {/* Top row on small: icon + count */}
                <div className="flex items-center space-x-1 sm:space-x-1">
                  <span className="text-lg sm:text-2xl">{tab.icon}</span>
                  <span className="rounded-full bg-gray-300 px-2 sm:px-2 py-0.5 text-[10px] sm:text-xs">
                    {tab.count}
                  </span>
                </div>

                {/* Title row */}
                <span className="text-sm sm:text-lg truncate mt-1 sm:mt-0 text-center sm:text-left">
                  {tab.title}
                </span>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Right Section - Items-center added for vertical alignment on desktop */}
        <div className="flex  items-center justify-end gap-2 mt-2 md:mt-4">
          <button className="rounded-sm border px-3 py-4 flex-shrink-0 flex items-center justify-center">
            <RefreshCcw size={14} />
          </button>
          <button className="rounded-sm border px-3 py-4 flex-shrink-0 flex items-center justify-center">
            <Search size={14} />
          </button>
          <div className="flex-shrink-0">
            <NewOrderDropdown />
          </div>
        </div>
      </div>

      {tablist.map((tab) => (
        <TabsContent key={tab.id} value={tab.title}>
          {tab?.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default OrderTabsSection;
