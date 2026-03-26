import { redirect } from "next/navigation";
import Link from "next/link";
import { Calendar, BarChart3, Lightbulb } from "lucide-react";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vie associative | Staffez Les Tous",
  description: "Sorties, sondages et boite a idees de l'association.",
};

export default async function VieAssociativePage() {
  const session = await auth();
  if (!session?.user) redirect("/connexion");

  const [nextSorties, activePolls, recentIdeas] = await Promise.all([
    prisma.event.findMany({
      where: {
        type: "VIE_ASSOCIATIVE",
        status: "PUBLIE",
        startDate: { gte: new Date() },
      },
      orderBy: { startDate: "asc" },
      take: 3,
      select: { id: true, title: true, slug: true, startDate: true, location: true },
    }),
    prisma.poll.findMany({
      where: { closesAt: { gt: new Date() } },
      orderBy: { closesAt: "asc" },
      take: 3,
      select: { id: true, question: true, closesAt: true },
    }),
    prisma.idea.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: "desc" },
      take: 3,
      include: { _count: { select: { likes: true } } },
    }),
  ]);

  return (
    <div>
      <h1 className="mb-8 font-display text-2xl font-black uppercase tracking-wider text-white">
        Vie associative
      </h1>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Sorties */}
        <Link
          href="/espace-membre/vie-associative/sorties"
          className="group rounded-xl border border-white/10 bg-surface-dark p-6 transition-all hover:border-brand-red/40"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-red/20">
            <Calendar className="h-6 w-6 text-brand-red" />
          </div>
          <h2 className="font-display text-sm font-bold uppercase tracking-wider text-white group-hover:text-brand-red-vivid">
            Sorties
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            {nextSorties.length > 0
              ? `${nextSorties.length} sortie${nextSorties.length > 1 ? "s" : ""} a venir`
              : "Aucune sortie prevue"}
          </p>
          {nextSorties[0] && (
            <p className="mt-2 text-xs text-gray-500">
              Prochaine : {nextSorties[0].title}
              {nextSorties[0].startDate &&
                ` — ${new Date(nextSorties[0].startDate).toLocaleDateString("fr-FR")}`}
            </p>
          )}
        </Link>

        {/* Sondages */}
        <Link
          href="/espace-membre/vie-associative/sondages"
          className="group rounded-xl border border-white/10 bg-surface-dark p-6 transition-all hover:border-brand-red/40"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/20">
            <BarChart3 className="h-6 w-6 text-blue-400" />
          </div>
          <h2 className="font-display text-sm font-bold uppercase tracking-wider text-white group-hover:text-brand-red-vivid">
            Sondages
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            {activePolls.length > 0
              ? `${activePolls.length} sondage${activePolls.length > 1 ? "s" : ""} en cours`
              : "Aucun sondage actif"}
          </p>
          {activePolls[0] && (
            <p className="mt-2 line-clamp-1 text-xs text-gray-500">{activePolls[0].question}</p>
          )}
        </Link>

        {/* Boite a idees */}
        <Link
          href="/espace-membre/vie-associative/idees"
          className="group rounded-xl border border-white/10 bg-surface-dark p-6 transition-all hover:border-brand-red/40"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-500/20">
            <Lightbulb className="h-6 w-6 text-yellow-400" />
          </div>
          <h2 className="font-display text-sm font-bold uppercase tracking-wider text-white group-hover:text-brand-red-vivid">
            Boite a idees
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            {recentIdeas.length > 0
              ? `${recentIdeas.length} idee${recentIdeas.length > 1 ? "s" : ""} recentes`
              : "Aucune idee pour le moment"}
          </p>
          {recentIdeas[0] && (
            <p className="mt-2 line-clamp-1 text-xs text-gray-500">
              {recentIdeas[0].title} — {recentIdeas[0]._count.likes} vote
              {recentIdeas[0]._count.likes > 1 ? "s" : ""}
            </p>
          )}
        </Link>
      </div>
    </div>
  );
}
