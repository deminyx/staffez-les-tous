import { redirect } from "next/navigation";
import Link from "next/link";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Boutique | Staffez Les Tous",
  description: "Catalogue du merchandising associatif reserve aux adherents.",
};

export default async function BoutiquePage() {
  const session = await auth();
  if (!session?.user) redirect("/connexion");

  const products = await prisma.product.findMany({
    where: { isAvailable: true },
    include: {
      variants: {
        select: { id: true, label: true, stock: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalStock = (variants: Array<{ stock: number }>) =>
    variants.reduce((sum, v) => sum + v.stock, 0);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-black uppercase tracking-wider text-brand-black">
            Boutique
          </h1>
          <p className="mt-1 text-sm text-gray-500">Merch associatif — tarif adherent</p>
        </div>
        <Link
          href="/espace-membre/boutique/panier"
          className="rounded-lg bg-brand-red px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-brand-red-vivid"
        >
          Mon panier
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-gray-500">Aucun article disponible pour le moment.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const stock = totalStock(product.variants);
            const isOutOfStock = stock === 0;

            return (
              <Link
                key={product.id}
                href={`/espace-membre/boutique/${product.slug}`}
                className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:border-brand-red/40 hover:shadow-md"
              >
                {/* Image placeholder */}
                <div className="relative aspect-square bg-gray-50">
                  {product.image ? (
                    <div
                      className="h-full w-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${product.image})` }}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="font-display text-4xl text-gray-200">S</span>
                    </div>
                  )}
                  {isOutOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                      <span className="rounded-full bg-red-500/20 px-4 py-1 text-sm font-bold text-red-400">
                        Epuise
                      </span>
                    </div>
                  )}
                  <div className="absolute right-2 top-2 rounded-full bg-brand-red px-3 py-1 text-xs font-bold text-white">
                    Tarif adherent
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h2 className="font-display text-sm font-bold uppercase tracking-wider text-brand-black group-hover:text-brand-red-vivid">
                    {product.title}
                  </h2>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-lg font-bold text-brand-red">
                      {(product.priceMember / 100).toFixed(2)} &euro;
                    </span>
                    {product.pricePublic && (
                      <span className="text-xs text-gray-400 line-through">
                        {(product.pricePublic / 100).toFixed(2)} &euro;
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {product.variants.length} variante{product.variants.length > 1 ? "s" : ""} —{" "}
                    {stock} en stock
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
