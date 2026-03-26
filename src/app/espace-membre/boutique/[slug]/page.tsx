import { redirect, notFound } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AddToCartButton } from "@/components/features/AddToCartButton";

import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    select: { title: true },
  });

  return {
    title: product ? `${product.title} | Boutique | Staffez Les Tous` : "Article introuvable",
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user) redirect("/connexion");

  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      variants: {
        select: { id: true, label: true, stock: true },
        orderBy: { label: "asc" },
      },
    },
  });

  if (!product || !product.isAvailable) {
    notFound();
  }

  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-400">
        <a href="/espace-membre/boutique" className="hover:text-white">
          Boutique
        </a>
        <span className="mx-2">/</span>
        <span className="text-white">{product.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image */}
        <div className="aspect-square overflow-hidden rounded-xl border border-white/10 bg-white/5">
          {product.image ? (
            <div
              className="h-full w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${product.image})` }}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="font-display text-6xl text-white/20">S</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <h1 className="font-display text-2xl font-black uppercase tracking-wider text-white">
            {product.title}
          </h1>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-brand-red">
              {(product.priceMember / 100).toFixed(2)} &euro;
            </span>
            {product.pricePublic && (
              <span className="text-lg text-gray-500 line-through">
                {(product.pricePublic / 100).toFixed(2)} &euro;
              </span>
            )}
            <span className="rounded-full bg-brand-red/20 px-3 py-1 text-xs font-bold text-brand-red">
              Tarif adherent
            </span>
          </div>

          <p className="mt-6 leading-relaxed text-gray-300">{product.description}</p>

          <div className="mt-6">
            <p className="text-sm text-gray-400">
              {totalStock > 0
                ? `${totalStock} article${totalStock > 1 ? "s" : ""} en stock`
                : "Rupture de stock"}
            </p>
          </div>

          {totalStock > 0 && (
            <AddToCartButton
              productTitle={product.title}
              image={product.image}
              priceMember={product.priceMember}
              variants={product.variants.map((v) => ({
                id: v.id,
                label: v.label,
                stock: v.stock,
              }))}
            />
          )}
        </div>
      </div>
    </div>
  );
}
