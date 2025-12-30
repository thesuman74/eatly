import SidePreview from "@/components/dashboard/SidePreview";

export default function MenuPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="flex-grow w-full  md:overflow-y-auto px-1 ">
        {children}
      </div>
      {/* <SidePreview src="/menu" showSidePreview={true} /> */}
    </div>
  );
}
