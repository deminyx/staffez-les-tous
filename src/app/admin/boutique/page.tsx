import { redirect } from "next/navigation";
import Link from "next/link";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole } from "@/lib/permissions";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Boutique | Admin | Staffez Les Tous",
};

export default async function AdminBoutiquePage() {
  const session = await auth();
  if (!session?.user) redirect("/connexion");
  requireAuth(session);
  requireRole(session, ["ADMINISTRATEUR", "DEVELOPPEUR"]);

  const [productsCount, ordersCount, pendingOrders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.count({ where: { status: "EN_ATTENTE" } }),
  ]);

  return (
    <div>
      <h1 className="mb-8 font-display text-2xl font-black uppercase tracking-wider text-brand-black">
        Gestion boutique
      </h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Link
          href="/admin/boutique/articles"
          className="card group p-6 transition-all hover:border-brand-red/40"
        >
          <p className="text-3xl font-bold text-brand-red">{productsCount}</p>
          <p className="mt-1 text-sm text-gray-500 group-hover:text-brand-black">
            Articles au catalogue
          </p>
        </Link>

        <Link
          href="/admin/boutique/commandes"
          className="card group p-6 transition-all hover:border-brand-red/40"
        >
          <p className="text-3xl font-bold text-blue-500">{ordersCount}</p>
          <p className="mt-1 text-sm text-gray-500 group-hover:text-brand-black">Commandes</p>
          {pendingOrders > 0 && (
            <p className="mt-2 text-xs text-yellow-600">{pendingOrders} en attente de paiement</p>
          )}
        </Link>
      </div>
    </div>
  );
}
