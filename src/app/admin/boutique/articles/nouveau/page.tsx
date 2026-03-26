import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { requireAuth, requireRole } from "@/lib/permissions";
import { ProductForm } from "@/components/features/ProductForm";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nouvel article | Admin | Staffez Les Tous",
};

export default async function NouvelArticlePage() {
  const session = await auth();
  if (!session?.user) redirect("/connexion");
  requireAuth(session);
  requireRole(session, ["ADMINISTRATEUR", "DEVELOPPEUR"]);

  return (
    <div>
      <h1 className="mb-8 font-display text-2xl font-black uppercase tracking-wider text-brand-black">
        Nouvel article
      </h1>
      <ProductForm />
    </div>
  );
}
