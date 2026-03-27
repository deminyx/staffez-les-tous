import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

import { AdminSidebar } from "@/components/layout/AdminSidebar";
import type { Role } from "@prisma/client";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/connexion");

  const userRoles = (session.user.roles ?? []).map((r) => r.role) as Role[];

  return (
    <div className="flex min-h-screen bg-surface-light">
      <AdminSidebar userRoles={userRoles} />

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
