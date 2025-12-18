import { AppSidebar } from "@/components/app-sidebar";
import { RestaurantProvider } from "@/components/HOC/RestaurantProvider";
import ProductOrdersheet from "@/components/sheet/ProductOrdersheet";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getUserOnboardingStatus } from "@/lib/supabase/getUserOnboardingStatus";
import { getUserRestaurants } from "@/services/resturantServices";
import { useRestaurantStore } from "@/stores/admin/restaurantStore";
import { Separator } from "@radix-ui/react-select";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Check onboarding
  const onboarding = await getUserOnboardingStatus();
  const restaurantData = await getUserRestaurants();

  if (!onboarding.completed) {
    redirect("/onboarding");
  }

  return (
    <RestaurantProvider restaurants={restaurantData}>
      <SidebarProvider>
        <AppSidebar restaurants={restaurantData} />
        <SidebarInset>
          <header className="flex h-16   sticky z-10 top-0 shrink-0 items-center gap-2 transition-[width,height] bg-primary text-white ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator aria-orientation="vertical" className="mr-2 h-4" />
            </div>
          </header>
          {/* <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <div className="aspect-video rounded-xl bg-gray-300/50" />
                <div className="aspect-video rounded-xl bg-gray-300/50" />
                <div className="aspect-video rounded-xl bg-gray-300/50" />
              </div>
              <div className="min-h-[100vh] flex-1 rounded-xl bg-gray-300/50 md:min-h-min" />
            </div> */}

          {children}
        </SidebarInset>
      </SidebarProvider>
    </RestaurantProvider>
  );
}
