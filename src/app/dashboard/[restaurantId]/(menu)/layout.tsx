import SidePreview from "@/components/dashboard/SidePreview";

export default function MenuPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      {/* Main content */}
      <main className="flex-1 overflow-y-auto px-4">{children}</main>

      {/* Right preview panel */}
      <aside className="hidden md:block">
        <SidePreview src="menu" showSidePreview />
      </aside>
    </div>
  );
}
