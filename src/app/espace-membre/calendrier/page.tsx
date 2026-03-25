import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Calendar as CalendarIcon, MapPin, ChevronRight, Filter } from "lucide-react";
import { formatDate } from "@/lib/utils";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calendrier des evenements",
};

export default async function CalendrierPage() {
  const session = await auth();
  if (!session?.user) redirect("/connexion");

  // Charger les evenements publies, tries par date
  const events = await prisma.event.findMany({
    where: { status: "PUBLIE" },
    orderBy: { startDate: "asc" },
    select: {
      id: true,
      title: true,
      slug: true,
      startDate: true,
      endDate: true,
      location: true,
      type: true,
      inscriptionOpen: true,
      maxVolunteers: true,
      _count: {
        select: { inscriptions: true },
      },
    },
  });

  // Verifier les inscriptions de l'utilisateur
  const userInscriptions = await prisma.inscription.findMany({
    where: { userId: session.user.id },
    select: { eventId: true, status: true },
  });

  const inscriptionMap = new Map(
    userInscriptions.map((i) => [i.eventId, i.status]),
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-black uppercase text-brand-black md:text-3xl">
            Calendrier
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Tous les evenements de l&apos;association
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" aria-hidden="true" />
          <span className="text-xs text-gray-400">
            {events.length} evenement{events.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="section-divider" aria-hidden="true" />

      {/* Events list */}
      {events.length === 0 ? (
        <div className="card flex flex-col items-center gap-4 p-12 text-center">
          <CalendarIcon className="h-12 w-12 text-gray-300" aria-hidden="true" />
          <div>
            <p className="font-display font-bold text-brand-black">
              Aucun evenement publie
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Les evenements a venir apparaitront ici des leur publication.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => {
            const inscriptionStatus = inscriptionMap.get(event.id);
            const isFull =
              event.maxVolunteers !== null &&
              event._count.inscriptions >= event.maxVolunteers;

            return (
              <Link
                key={event.id}
                href={`/espace-membre/evenements/${event.slug}`}
                className="card group flex items-center gap-4 p-5 transition-transform hover:-translate-y-0.5"
              >
                {/* Date badge */}
                <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-brand-red/10 text-brand-red">
                  {event.startDate ? (
                    <>
                      <span className="text-xs font-medium uppercase">
                        {new Intl.DateTimeFormat("fr-FR", { month: "short" }).format(event.startDate)}
                      </span>
                      <span className="font-display text-lg font-black">
                        {event.startDate.getDate()}
                      </span>
                    </>
                  ) : (
                    <CalendarIcon className="h-5 w-5" aria-hidden="true" />
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate font-display text-base font-bold text-brand-black">
                      {event.title}
                    </h2>
                    <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                      {event.type === "PRESTATION" ? "Prestation" : "Vie asso"}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                    {event.startDate && (
                      <span>
                        {formatDate(event.startDate)}
                        {event.endDate && event.endDate.getTime() !== event.startDate.getTime()
                          ? ` — ${formatDate(event.endDate)}`
                          : ""}
                      </span>
                    )}
                    {event.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" aria-hidden="true" />
                        {event.location}
                      </span>
                    )}
                  </div>
                </div>

                {/* Status badge */}
                <div className="flex shrink-0 items-center gap-2">
                  {inscriptionStatus === "VALIDEE" && (
                    <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                      Inscrit
                    </span>
                  )}
                  {inscriptionStatus === "EN_ATTENTE" && (
                    <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
                      En attente
                    </span>
                  )}
                  {inscriptionStatus === "REFUSEE" && (
                    <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
                      Refusee
                    </span>
                  )}
                  {!inscriptionStatus && event.inscriptionOpen && !isFull && (
                    <span className="rounded-full bg-brand-red/10 px-2.5 py-1 text-xs font-medium text-brand-red">
                      Ouvert
                    </span>
                  )}
                  {!inscriptionStatus && isFull && (
                    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">
                      Complet
                    </span>
                  )}
                  <ChevronRight
                    className="h-4 w-4 text-gray-300 transition-colors group-hover:text-brand-red"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
