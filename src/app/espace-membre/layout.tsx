import { MemberSidebar } from "@/components/layout/MemberSidebar";

export default function EspaceMembreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-surface-light">
      <MemberSidebar />

      {/* Main content area — offset by sidebar width on desktop */}
      <main
        id="main-content"
        className="min-h-screen flex-1 px-4 pb-8 pt-20 lg:ml-64 lg:px-8 lg:pt-8"
      >
        {children}
      </main>
    </div>
  );
}
