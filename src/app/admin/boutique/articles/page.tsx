import { redirect } from "next/navigation";
import Link from "next/link";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole } from "@/lib/permissions";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gestion articles | Admin | Staffez Les Tous",
};

export default async function AdminArticlesPage() {
  const session = await auth();
  if (!session?.user) redirect("/connexion");
  requireAuth(session);
  requireRole(session, ["ADMINISTRATEUR", "DEVELOPPEUR"]);

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      variants: { select: { id: true, label: true, stock: true } },
      _count: { select: { variants: true } },
    },
  });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-black uppercase tracking-wider text-white">
            Gestion des articles
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            {products.length} article{products.length > 1 ? "s" : ""} au catalogue
          </p>
        </div>
        <Link
          href="/admin/boutique/articles/nouveau"
          className="rounded-lg bg-brand-red px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-brand-red-vivid"
        >
          + Nouvel article
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-surface-dark p-12 text-center">
          <p className="text-gray-400">Aucun article dans le catalogue.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/10 bg-surface-dark">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-gray-500">
                <th className="px-4 py-3">Article</th>
                <th className="px-4 py-3">Prix adherent</th>
                <th className="px-4 py-3">Stock total</th>
                <th className="px-4 py-3">Variantes</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.map((product) => {
                const totalStock = product.variants.reduce((s, v) => s + v.stock, 0);
                return (
                  <tr key={product.id} className="text-gray-300 hover:bg-white/5">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-white">{product.title}</p>
                        <p className="text-xs text-gray-500">/{product.slug}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">{(product.priceMember / 100).toFixed(2)} &euro;</td>
                    <td className="px-4 py-3">{totalStock}</td>
                    <td className="px-4 py-3">{product._count.variants}</td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          product.isAvailable
                            ? "rounded-full bg-green-500/20 px-2 py-1 text-xs text-green-400"
                            : "rounded-full bg-red-500/20 px-2 py-1 text-xs text-red-400"
                        }
                      >
                        {product.isAvailable ? "Disponible" : "Indisponible"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/boutique/articles/${product.slug}`}
                        className="text-brand-red hover:underline"
                      >
                        Modifier
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
