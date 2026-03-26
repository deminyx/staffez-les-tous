import { redirect, notFound } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole } from "@/lib/permissions";
import { ProductForm } from "@/components/features/ProductForm";

import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Modifier ${slug} | Admin | Staffez Les Tous` };
}

export default async function EditArticlePage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user) redirect("/connexion");
  requireAuth(session);
  requireRole(session, ["ADMINISTRATEUR", "DEVELOPPEUR"]);

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

  if (!product) notFound();

  return (
    <div>
      <h1 className="mb-8 font-display text-2xl font-black uppercase tracking-wider text-white">
        Modifier l&apos;article
      </h1>
      <ProductForm
        productId={product.id}
        defaultValues={{
          title: product.title,
          slug: product.slug,
          description: product.description,
          image: product.image ?? "",
          priceMember: product.priceMember,
          pricePublic: product.pricePublic,
          isAvailable: product.isAvailable,
          variants: product.variants,
        }}
      />
    </div>
  );
}
