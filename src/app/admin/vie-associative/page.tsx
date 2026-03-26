import { redirect } from "next/navigation";
import Link from "next/link";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole } from "@/lib/permissions";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vie associative | Admin | Staffez Les Tous",
};

export default async function AdminVieAssociativePage() {
  const session = await auth();
  if (!session?.user) redirect("/connexion");
  requireAuth(session);
  requireRole(session, ["ADMINISTRATEUR", "DEVELOPPEUR"]);

  const [sortiesCount, pollsCount, ideasCount, pendingIdeas] = await Promise.all([
    prisma.event.count({ where: { type: "VIE_ASSOCIATIVE" } }),
    prisma.poll.count(),
    prisma.idea.count(),
    prisma.idea.count({ where: { isApproved: false } }),
  ]);

  return (
    <div>
      <h1 className="mb-8 font-display text-2xl font-black uppercase tracking-wider text-white">
        Vie associative
      </h1>

      <div className="grid gap-6 md:grid-cols-3">
        <Link
          href="/admin/evenements"
          className="group rounded-xl border border-white/10 bg-surface-dark p-6 transition-all hover:border-brand-red/40"
        >
          <p className="text-3xl font-bold text-brand-red">{sortiesCount}</p>
          <p className="mt-1 text-sm text-gray-400 group-hover:text-white">
            Sorties (via Evenements)
          </p>
          <p className="mt-2 text-xs text-gray-500">
            Les sorties sont gerees via les evenements de type &quot;Vie associative&quot;
          </p>
        </Link>

        <Link
          href="/admin/vie-associative/sondages"
          className="group rounded-xl border border-white/10 bg-surface-dark p-6 transition-all hover:border-brand-red/40"
        >
          <p className="text-3xl font-bold text-blue-400">{pollsCount}</p>
          <p className="mt-1 text-sm text-gray-400 group-hover:text-white">Sondages</p>
        </Link>

        <Link
          href="/admin/vie-associative/idees"
          className="group rounded-xl border border-white/10 bg-surface-dark p-6 transition-all hover:border-brand-red/40"
        >
          <p className="text-3xl font-bold text-yellow-400">{ideasCount}</p>
          <p className="mt-1 text-sm text-gray-400 group-hover:text-white">Idees</p>
          {pendingIdeas > 0 && (
            <p className="mt-2 text-xs text-yellow-400">{pendingIdeas} en attente de moderation</p>
          )}
        </Link>
      </div>
    </div>
  );
}
