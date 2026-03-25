import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Nos evenements",
  description:
    "Decouvrez les evenements manga, gaming et pop culture ou Staffez Les Tous intervient.",
};

/**
 * Donnees d'evenements statiques (placeholder).
 * A remplacer par un fetch depuis la base de donnees (Prisma) quand le back-end sera en place.
 */
const PLACEHOLDER_EVENTS = [
  {
    id: "1",
    slug: "art-to-play-2024",
    title: "Art to Play 2024",
    description:
      "Festival de culture pop, manga, jeux video et jeux de societe a Nantes. Staffez Les Tous assure l'accueil, la billetterie et la logistique benevole.",
    location: "Parc des Expositions, Nantes",
    date: "Novembre 2024",
    coverColor: "bg-brand-red/20",
  },
  {
    id: "2",
    slug: "manga-city-2024",
    title: "Manga City 2024",
    description:
      "Convention manga et anime avec concours cosplay, stands exposants et animations. L'equipe gere le staffing des espaces visiteurs.",
    location: "Zenith, Nantes",
    date: "Mars 2024",
    coverColor: "bg-surface-dark/20",
  },
  {
    id: "3",
    slug: "game-arena-2024",
    title: "Game Arena 2024",
    description:
      "Evenement gaming et esport avec tournois, espace retrogaming et conferences. Nos benevoles encadrent les tournois et la scene principale.",
    location: "Cite des Congres, Nantes",
    date: "Juin 2024",
    coverColor: "bg-brand-red-dark/20",
  },
  {
    id: "4",
    slug: "nantes-geek-festival",
    title: "Nantes Geek Festival",
    description:
      "Rassemblement de la culture geek et pop : comics, figurines, jeux de role, projections. Staffez Les Tous y assure la securite et l'orientation du public.",
    location: "Cite des Congres, Nantes",
    date: "Septembre 2024",
    coverColor: "bg-surface-card",
  },
];

export default function EvenementsPage() {
  return (
    <main id="main-content">
      {/* Header bandeau */}
      <section className="section-header text-center">
        <h1 className="text-4xl font-black uppercase md:text-5xl">
          Nos evenements
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-white/80">
          Retrouvez tous les evenements manga, gaming et pop culture ou notre
          association intervient avec ses equipes de benevoles.
        </p>
      </section>

      {/* Event grid */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PLACEHOLDER_EVENTS.map((event) => (
            <Link
              key={event.id}
              href={`/evenements/${event.slug}`}
              className="card group overflow-hidden transition-transform hover:-translate-y-1"
            >
              {/* Cover placeholder */}
              <div
                className={`aspect-video ${event.coverColor} flex items-center justify-center`}
              >
                <span className="font-display text-sm font-bold uppercase tracking-wider text-gray-400">
                  Photo a venir
                </span>
              </div>

              <div className="p-5">
                <h2 className="font-display text-xl font-bold text-brand-black group-hover:text-brand-red">
                  {event.title}
                </h2>
                <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                  {event.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-500">
                  {event.date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                      {event.date}
                    </span>
                  )}
                  {event.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                      {event.location}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
