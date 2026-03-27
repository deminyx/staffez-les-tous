import { redirect } from "next/navigation";
import Link from "next/link";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vie associative | Admin | Staffez Les Tous",
};

export default async function AdminVieAssociativePage() {
  const session = await auth();
  if (!session?.user) redirect("/connexion");

  const canAccess = session.user.roles?.some(
    (r) => r.role === "ADMINISTRATEUR" || r.role === "DEVELOPPEUR",
  );
  if (!canAccess) redirect("/admin");

  const [sortiesCount, pollsCount, ideasCount, pendingIdeas] = await Promise.all([
    prisma.event.count({ where: { type: "VIE_ASSOCIATIVE" } }),
    prisma.poll.count(),
    prisma.idea.count(),
    prisma.idea.count({ where: { isApproved: false } }),
  ]);

  return (
    <div>
      <h1 className="mb-8 font-display text-2xl font-black uppercase tracking-wider text-brand-black">
        Vie associative
      </h1>

      <div className="grid gap-6 md:grid-cols-3">
        <Link
          href="/admin/evenements"
          className="card group p-6 transition-all hover:border-brand-red/40"
        >
          <p className="text-3xl font-bold text-brand-red">{sortiesCount}</p>
          <p className="mt-1 text-sm text-gray-500 group-hover:text-brand-black">
            Sorties (via Evenements)
          </p>
          <p className="mt-2 text-xs text-gray-500">
            Les sorties sont gerees via les evenements de type &quot;Vie associative&quot;
          </p>
        </Link>

        <Link
          href="/admin/vie-associative/sondages"
          className="card group p-6 transition-all hover:border-brand-red/40"
        >
          <p className="text-3xl font-bold text-blue-500">{pollsCount}</p>
          <p className="mt-1 text-sm text-gray-500 group-hover:text-brand-black">Sondages</p>
        </Link>

        <Link
          href="/admin/vie-associative/idees"
          className="card group p-6 transition-all hover:border-brand-red/40"
        >
          <p className="text-3xl font-bold text-yellow-500">{ideasCount}</p>
          <p className="mt-1 text-sm text-gray-500 group-hover:text-brand-black">Idees</p>
          {pendingIdeas > 0 && (
            <p className="mt-2 text-xs text-yellow-600">{pendingIdeas} en attente de moderation</p>
          )}
        </Link>
      </div>
    </div>
  );
}
