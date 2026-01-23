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
    <Tabs defaultValue="Counter" className="w-full mt-2 px-4">
      <div className="flex justify-between">
        {/* Tab List */}
        <TabsList className="grid grid-cols-3 p-0 gap-0  ">
          {tablist.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.title}
              className="border-2  border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-500"
            >
              <div className="flex items-center space-x-2 px-4 py-2 bg-background font-bold">
                <span className="text-2xl">{tab.icon}</span>
                <span className="text-lg ">{tab.title}</span>
                <span className="rounded-full bg-gray-300 px-2 py-1 text-xs">
                  {tab.count}
                </span>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Right Section */}
        <div className="flex gap-2">
          <button className="rounded-sm border px-6">
            <RefreshCcw size={14} />
          </button>
          <button className="rounded-sm border  px-6">
            <Search size={14} />
          </button>
          {/* <button className="flex items-center gap-2 rounded-sm bg-blue-500 px-4 py-2 text-white">
            <span>+</span>
            <span>New Orders</span>
          </button> */}
          <NewOrderDropdown />
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
