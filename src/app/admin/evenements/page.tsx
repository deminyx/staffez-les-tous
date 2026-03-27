import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Pencil, Users as UsersIcon } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Evenements — Administration",
};

const STATUS_BADGE: Record<string, string> = {
  BROUILLON: "bg-gray-100 text-gray-600",
  PUBLIE: "bg-green-100 text-green-700",
  ARCHIVE: "bg-amber-100 text-amber-700",
};

const STATUS_LABEL: Record<string, string> = {
  BROUILLON: "Brouillon",
  PUBLIE: "Publie",
  ARCHIVE: "Archive",
};

export default async function AdminEventsPage() {
  const session = await auth();
  if (!session?.user) redirect("/connexion");

  const canAccess = session.user.roles?.some(
    (r) => r.role === "ADMINISTRATEUR" || r.role === "DEVELOPPEUR" || r.role === "COORDINATEUR",
  );
  if (!canAccess) redirect("/admin");

  const events = await prisma.event.findMany({
    include: {
      _count: { select: { inscriptions: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-black uppercase text-brand-black">
            Evenements
          </h1>
          <p className="text-sm text-gray-500">
            {events.length} evenement{events.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/admin/evenements/nouveau" className="btn-primary gap-2">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Nouvel evenement
        </Link>
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
                  className="hidden px-4 py-3 text-left font-semibold text-gray-600 md:table-cell"
                >
                  Dates
                </th>
                <th scope="col" className="px-4 py-3 text-left font-semibold text-gray-600">
                  Statut
                </th>
                <th scope="col" className="px-4 py-3 text-center font-semibold text-gray-600">
                  Inscriptions
                </th>
                <th
                  scope="col"
                  className="hidden px-4 py-3 text-center font-semibold text-gray-600 sm:table-cell"
                >
                  Ouvert
                </th>
                <th scope="col" className="px-4 py-3 text-right font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-brand-black">{event.title}</p>
                      <p className="text-xs text-gray-400">{event.location ?? "—"}</p>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-gray-600 md:table-cell">
                    {event.startDate
                      ? formatDate(new Date(event.startDate), {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                    {event.endDate && (
                      <>
                        {" — "}
                        {formatDate(new Date(event.endDate), {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE[event.status] ?? ""}`}
                    >
                      {STATUS_LABEL[event.status] ?? event.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-medium">
                      {event._count.inscriptions}
                      {event.maxVolunteers ? ` / ${event.maxVolunteers}` : ""}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-center sm:table-cell">
                    <span
                      className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${
                        event.inscriptionOpen
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {event.inscriptionOpen ? "O" : "F"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/evenements/${event.slug}`}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-brand-black"
                        aria-label={`Modifier ${event.title}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/admin/evenements/${event.slug}/equipe`}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-brand-black"
                        aria-label={`Gerer l'equipe de ${event.title}`}
                      >
                        <UsersIcon className="h-4 w-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    Aucun evenement. Creez-en un pour commencer.
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
