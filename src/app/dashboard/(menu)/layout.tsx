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
      <div className="flex-grow  md:overflow-y-auto ">{children}</div>
      <div className="bg-gray-400 h-screen flex-none md:w-96 justify-center items-center flex overflow-x-hidden  ">
        <iframe
          src="/menu"
          className="w-[330px] h-[600px] border rounded-xl shadow-lg bg-red-200"
        ></iframe>
      </div>
    </div>
  );
}
