import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole } from "@/lib/permissions";
import { OrderRow } from "@/components/features/OrderRow";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/constants";

import type { Metadata } from "next";
import type { OrderStatus } from "@/types";

export const metadata: Metadata = {
  title: "Gestion commandes | Admin | Staffez Les Tous",
};

export default async function AdminCommandesPage() {
  const session = await auth();
  if (!session?.user) redirect("/connexion");
  requireAuth(session);
  requireRole(session, ["ADMINISTRATEUR", "DEVELOPPEUR"]);

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { firstName: true, lastName: true, email: true } },
      items: {
        include: {
          variant: {
            include: { product: { select: { title: true } } },
          },
        },
      },
    },
  });

  return (
    <div>
      <h1 className="mb-8 font-display text-2xl font-black uppercase tracking-wider text-brand-black">
        Gestion des commandes
      </h1>

      {orders.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-gray-500">Aucune commande pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="card p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-display text-sm font-bold uppercase tracking-wider text-brand-black">
                    {order.orderNumber}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {order.user.firstName} {order.user.lastName} ({order.user.email})
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-brand-red">
                    {(order.totalCents / 100).toFixed(2)} &euro;
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${ORDER_STATUS_COLORS[order.status as OrderStatus]}`}
                  >
                    {ORDER_STATUS_LABELS[order.status as OrderStatus]}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="mt-4 border-t border-gray-100 pt-4">
                <ul className="space-y-1 text-sm text-gray-600">
                  {order.items.map((item) => (
                    <li key={item.id} className="flex justify-between">
                      <span>
                        {item.variant.product.title} — {item.variant.label} x{item.quantity}
                      </span>
                      <span className="text-gray-500">
                        {((item.unitPrice * item.quantity) / 100).toFixed(2)} &euro;
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Status actions */}
              <OrderRow orderId={order.id} currentStatus={order.status as OrderStatus} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
