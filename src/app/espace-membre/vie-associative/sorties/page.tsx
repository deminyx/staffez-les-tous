import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SortieCard } from "@/components/features/SortieCard";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sorties | Vie associative | Staffez Les Tous",
};

export default async function SortiesPage() {
  const session = await auth();
  if (!session?.user) redirect("/connexion");

  const sorties = await prisma.event.findMany({
    where: {
      type: "VIE_ASSOCIATIVE",
      status: "PUBLIE",
    },
    orderBy: { startDate: "asc" },
    include: {
      inscriptions: {
        select: { userId: true },
      },
    },
  });

  const upcomingSorties = sorties.filter(
    (s) => !s.startDate || new Date(s.startDate) >= new Date(),
  );
  const pastSorties = sorties.filter((s) => s.startDate && new Date(s.startDate) < new Date());

  return (
    <div>
      <h1 className="mb-8 font-display text-2xl font-black uppercase tracking-wider text-white">
        Sorties
      </h1>

      {upcomingSorties.length === 0 && pastSorties.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-surface-dark p-12 text-center">
          <p className="text-gray-400">Aucune sortie prevue pour le moment.</p>
        </div>
      ) : (
        <>
          {upcomingSorties.length > 0 && (
            <section className="mb-10">
              <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-gray-400">
                A venir
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {upcomingSorties.map((sortie) => (
                  <SortieCard
                    key={sortie.id}
                    id={sortie.id}
                    title={sortie.title}
                    description={sortie.description}
                    startDate={sortie.startDate?.toISOString() ?? null}
                    endDate={sortie.endDate?.toISOString() ?? null}
                    location={sortie.location}
                    maxVolunteers={sortie.maxVolunteers}
                    inscriptionOpen={sortie.inscriptionOpen}
                    inscriptionCount={sortie.inscriptions.length}
                    isInscrit={sortie.inscriptions.some((i) => i.userId === session.user.id)}
                  />
                ))}
              </div>
            </section>
          )}

          {pastSorties.length > 0 && (
            <section>
              <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-gray-400">
                Passees
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {pastSorties.map((sortie) => (
                  <div
                    key={sortie.id}
                    className="rounded-xl border border-white/5 bg-surface-dark/50 p-6 opacity-60"
                  >
                    <h3 className="font-display text-sm font-bold uppercase text-white">
                      {sortie.title}
                    </h3>
                    {sortie.startDate && (
                      <p className="mt-1 text-xs text-gray-500">
                        {new Date(sortie.startDate).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-gray-600">
                      {sortie.inscriptions.length} participant
                      {sortie.inscriptions.length > 1 ? "s" : ""}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
