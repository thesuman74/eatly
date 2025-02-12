import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-select";

export default function MenuPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
      <div className="bg-gray-400 h-screen flex-none md:w-96">
        {/* <iframe
          src="/"
          className="w-[320px] h-[600px] border rounded-xl shadow-lg"
        ></iframe> */}
      </div>
    </div>
  );
}
