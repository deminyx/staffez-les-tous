import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Search } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { UserRow } from "@/components/features/UserRow";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Utilisateurs — Administration",
};

interface PageProps {
  searchParams: Promise<{ search?: string; role?: string }>;
}

export default async function UsersPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session?.user) redirect("/connexion");

  const canAccess = session.user.roles?.some(
    (r) => r.role === "ADMINISTRATEUR" || r.role === "DEVELOPPEUR",
  );
  if (!canAccess) redirect("/admin");

  const params = await searchParams;
  const search = params.search ?? "";
  const roleFilter = params.role ?? "";

  const users = await prisma.user.findMany({
    where: {
      ...(search
        ? {
            OR: [
              { firstName: { contains: search, mode: "insensitive" as const } },
              { lastName: { contains: search, mode: "insensitive" as const } },
              { email: { contains: search, mode: "insensitive" as const } },
              { username: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
      ...(roleFilter
        ? {
            roles: {
              some: {
                role: roleFilter as "EDITEUR" | "ADMINISTRATEUR" | "COORDINATEUR" | "DEVELOPPEUR",
              },
            },
          }
        : {}),
    },
    include: {
      roles: {
        select: { role: true, eventId: true },
      },
    },
    orderBy: { lastName: "asc" },
  });

  const events = await prisma.event.findMany({
    select: { id: true, title: true, slug: true },
    orderBy: { title: "asc" },
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-black uppercase text-brand-black">
            Utilisateurs
          </h1>
          <p className="text-sm text-gray-500">
            {users.length} utilisateur{users.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <form method="GET" className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              aria-hidden="true"
            />
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Rechercher par nom, email ou identifiant..."
              className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-4 text-sm focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
            />
          </div>
          <select
            name="role"
            defaultValue={roleFilter}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
          >
            <option value="">Tous les roles</option>
            <option value="EDITEUR">Editeur</option>
            <option value="COORDINATEUR">Coordinateur</option>
            <option value="ADMINISTRATEUR">Administrateur</option>
            <option value="DEVELOPPEUR">Developpeur</option>
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
                  Nom
                </th>
                <th scope="col" className="px-4 py-3 text-left font-semibold text-gray-600">
                  Identifiant
                </th>
                <th
                  scope="col"
                  className="hidden px-4 py-3 text-left font-semibold text-gray-600 md:table-cell"
                >
                  Email
                </th>
                <th scope="col" className="px-4 py-3 text-left font-semibold text-gray-600">
                  Roles
                </th>
                <th scope="col" className="px-4 py-3 text-left font-semibold text-gray-600">
                  Statut
                </th>
                <th scope="col" className="px-4 py-3 text-right font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <UserRow
                  key={user.id}
                  user={{
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    username: user.username,
                    email: user.email,
                    isActive: user.isActive,
                    roles: user.roles.map((r) => ({
                      role: r.role,
                      eventId: r.eventId,
                    })),
                  }}
                  events={events}
                />
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    Aucun utilisateur trouve.
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
