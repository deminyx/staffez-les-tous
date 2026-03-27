import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";

import { prisma } from "@/lib/prisma";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Publications — Administration",
};

const STATUS_BADGE: Record<string, string> = {
  BROUILLON: "bg-gray-100 text-gray-600",
  EN_ATTENTE: "bg-amber-100 text-amber-700",
  APPROUVEE: "bg-green-100 text-green-700",
  REJETEE: "bg-red-100 text-red-700",
};

const STATUS_LABEL: Record<string, string> = {
  BROUILLON: "Brouillon",
  EN_ATTENTE: "En attente",
  APPROUVEE: "Approuvee",
  REJETEE: "Rejetee",
};

const CATEGORY_LABEL: Record<string, string> = {
  NEWSLETTER: "Newsletter",
  ANNONCE_EVENEMENT: "Annonce",
  ACTUALITE: "Actualite",
};

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function PublicationsPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session?.user) redirect("/connexion");

  const canAccess = session.user.roles?.some(
    (r) => r.role === "ADMINISTRATEUR" || r.role === "DEVELOPPEUR" || r.role === "EDITEUR",
  );
  if (!canAccess) redirect("/admin");

  const params = await searchParams;
  const statusFilter = params.status ?? "";

  // Check if user is admin
  const isAdmin = session.user.roles?.some(
    (r: { role: string }) => r.role === "ADMINISTRATEUR" || r.role === "DEVELOPPEUR",
  );

  const publications = await prisma.publication.findMany({
    where: {
      ...(statusFilter
        ? { status: statusFilter as "BROUILLON" | "EN_ATTENTE" | "APPROUVEE" | "REJETEE" }
        : {}),
      // Editors only see their own publications
      ...(!isAdmin ? { authorId: session.user.id } : {}),
    },
    include: {
      author: {
        select: { firstName: true, lastName: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-black uppercase text-brand-black">
            Publications
          </h1>
          <p className="text-sm text-gray-500">
            {publications.length} publication{publications.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/admin/publications/nouveau" className="btn-primary gap-2">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Nouvelle publication
        </Link>
      </div>

      {/* Status filter */}
      <div className="card p-4">
        <form method="GET" className="flex flex-col gap-3 sm:flex-row">
          <select
            name="status"
            defaultValue={statusFilter}
            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
          >
            <option value="">Tous les statuts</option>
            <option value="BROUILLON">Brouillon</option>
            <option value="EN_ATTENTE">En attente</option>
            <option value="APPROUVEE">Approuvee</option>
            <option value="REJETEE">Rejetee</option>
          </select>
          <button type="submit" className="btn-primary">
            Filtrer
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th scope="col" className="px-4 py-3 text-left font-semibold text-gray-600">
                  Titre
                </th>
                <th
                  scope="col"
                  className="hidden px-4 py-3 text-left font-semibold text-gray-600 sm:table-cell"
                >
                  Categorie
                </th>
                {isAdmin && (
                  <th
                    scope="col"
                    className="hidden px-4 py-3 text-left font-semibold text-gray-600 md:table-cell"
                  >
                    Auteur
                  </th>
                )}
                <th scope="col" className="px-4 py-3 text-left font-semibold text-gray-600">
                  Statut
                </th>
                <th scope="col" className="px-4 py-3 text-right font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {publications.map((pub) => (
                <tr key={pub.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-brand-black">{pub.title}</p>
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <span className="text-gray-600">
                      {CATEGORY_LABEL[pub.category] ?? pub.category}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="hidden px-4 py-3 text-gray-600 md:table-cell">
                      {pub.author.firstName} {pub.author.lastName}
                    </td>
                  )}
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE[pub.status] ?? ""}`}
                    >
                      {STATUS_LABEL[pub.status] ?? pub.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/publications/${pub.id}`}
                      className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-brand-black"
                      aria-label={`Modifier ${pub.title}`}
                    >
                      <Pencil className="inline h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
              {publications.length === 0 && (
                <tr>
                  <td colSpan={isAdmin ? 5 : 4} className="px-4 py-8 text-center text-gray-500">
                    Aucune publication trouvee.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
