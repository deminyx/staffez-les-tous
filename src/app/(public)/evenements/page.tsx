import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, MapPin, ChevronRight } from "lucide-react";

import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Nos evenements",
  description:
    "Decouvrez les evenements manga, gaming et pop culture ou Staffez Les Tous intervient.",
};

export const dynamic = "force-dynamic";

export default async function EvenementsPage() {
  const events = await prisma.event.findMany({
    where: {
      status: "PUBLIE",
      type: "PRESTATION",
    },
    orderBy: [{ startDate: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      location: true,
      startDate: true,
      endDate: true,
    },
  });

  return (
    <main id="main-content">
      {/* Header bandeau (diagonal accents via CSS) */}
      <section className="section-header text-center">
        <h1 className="text-4xl font-black uppercase md:text-5xl">Nos evenements</h1>
        <p className="mx-auto mt-4 max-w-2xl text-white/80">
          Retrouvez tous les evenements manga, gaming et pop culture ou notre association intervient
          avec ses equipes de benevoles.
        </p>
      </section>

      {/* Event grid */}
      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 lg:px-8">
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-gray-300 py-20 text-center">
            <Calendar className="h-10 w-10 text-gray-300" aria-hidden="true" />
            <p className="text-gray-500">
              Aucun evenement publie pour le moment. Revenez bientot !
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => {
              const dateLabel = event.startDate
                ? new Intl.DateTimeFormat("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }).format(new Date(event.startDate))
                : null;

              return (
                <Link
                  key={event.id}
                  href={`/evenements/${event.slug}`}
                  className="card group overflow-hidden transition-transform hover:-translate-y-1"
                >
                  {/* Cover placeholder */}
                  <div className="card-event-cover">
                    <div className="flex aspect-video items-center justify-center bg-brand-red/10">
                      <span className="font-display text-sm font-bold uppercase tracking-wider text-gray-400">
                        Photo a venir
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h2 className="font-display text-xl font-bold text-brand-black transition-colors group-hover:text-brand-red">
                      {event.title}
                    </h2>
                    <p className="mt-2 line-clamp-2 text-sm text-gray-600">{event.description}</p>

                    <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      {dateLabel && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                          {dateLabel}
                        </span>
                      )}
                      {event.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                          {event.location}
                        </span>
                      )}
                      <span className="ml-auto inline-flex items-center gap-0.5 font-medium text-brand-red opacity-0 transition-opacity group-hover:opacity-100">
                        Voir
                        <ChevronRight className="h-3 w-3" aria-hidden="true" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
