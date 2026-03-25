import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, MapPin, ArrowLeft, Users } from "lucide-react";

/**
 * Donnees d'evenements statiques (placeholder).
 * A remplacer par un fetch Prisma quand le back-end sera en place.
 */
const EVENTS_DATA: Record<
  string,
  {
    title: string;
    description: string;
    missions: string;
    location: string;
    date: string;
    maxVolunteers: number;
  }
> = {
  "art-to-play-2024": {
    title: "Art to Play 2024",
    description:
      "Festival de culture pop, manga, jeux video et jeux de societe a Nantes. L'un des plus grands evenements de l'Ouest, Art to Play reunit chaque annee des milliers de passionnes pour un weekend de decouverte et de partage.",
    missions:
      "Accueil et orientation du public, controle des billets, gestion des flux aux entrees, aide a la logistique des stands exposants, assistance technique sur les espaces de demonstration, coordination des pauses benevoles.",
    location: "Parc des Expositions, Nantes",
    date: "15-17 Novembre 2024",
    maxVolunteers: 40,
  },
  "manga-city-2024": {
    title: "Manga City 2024",
    description:
      "Convention manga et anime avec concours cosplay, stands exposants et animations. Un rendez-vous incontournable pour les fans de culture japonaise dans la region nantaise.",
    missions:
      "Gestion de l'espace cosplay, accueil des artistes invites, orientation du public, vente et controle des billets, aide a la mise en place et au demontage.",
    location: "Zenith, Nantes",
    date: "23-24 Mars 2024",
    maxVolunteers: 25,
  },
  "game-arena-2024": {
    title: "Game Arena 2024",
    description:
      "Evenement gaming et esport avec tournois, espace retrogaming et conferences. Game Arena est devenu un rendez-vous majeur pour les joueurs et les professionnels du secteur.",
    missions:
      "Encadrement des tournois esport, gestion de l'espace retrogaming, accueil des participants, assistance technique sur les postes de jeu, gestion de la scene principale.",
    location: "Cite des Congres, Nantes",
    date: "8-9 Juin 2024",
    maxVolunteers: 30,
  },
  "nantes-geek-festival": {
    title: "Nantes Geek Festival",
    description:
      "Rassemblement de la culture geek et pop : comics, figurines, jeux de role, projections. Un festival convivial qui celebre toutes les facettes de la culture geek.",
    missions:
      "Securite et orientation du public, gestion des espaces de jeux de role, aide aux exposants, coordination logistique, accueil des visiteurs.",
    location: "Cite des Congres, Nantes",
    date: "14-15 Septembre 2024",
    maxVolunteers: 20,
  },
};

interface EvenementDetailPageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return Object.keys(EVENTS_DATA).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: EvenementDetailPageProps): Metadata {
  const event = EVENTS_DATA[params.slug];
  if (!event) {
    return { title: "Evenement introuvable" };
  }
  return {
    title: event.title,
    description: event.description.slice(0, 160),
  };
}

export default function EvenementDetailPage({ params }: EvenementDetailPageProps) {
  const event = EVENTS_DATA[params.slug];

  if (!event) {
    notFound();
  }

  return (
    <main id="main-content">
      {/* Header bandeau */}
      <section className="section-header">
        <div className="relative z-10 mx-auto max-w-4xl">
          <Link
            href="/evenements"
            className="mb-4 inline-flex items-center gap-1 text-sm text-white/70 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Retour aux evenements
          </Link>
          <h1 className="text-3xl font-black uppercase md:text-5xl">
            {event.title}
          </h1>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/80">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" aria-hidden="true" />
              {event.date}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              {event.location}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" aria-hidden="true" />
              {event.maxVolunteers} benevoles
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <article className="mx-auto max-w-4xl px-4 py-14 md:px-6 lg:px-8">
        {/* Photo placeholder */}
        <div className="relative mb-10 flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-surface-card">
          <div
            className="absolute right-0 top-0 h-20 w-20 bg-gradient-to-bl from-brand-red/10 to-transparent"
            aria-hidden="true"
          />
          <span className="font-display text-sm font-bold uppercase tracking-wider text-gray-400">
            Galerie photos a venir
          </span>
        </div>

        <section className="mb-10">
          <div className="mb-3 flex items-center gap-3">
            <div className="h-8 w-1.5 rounded-full bg-brand-red" aria-hidden="true" />
            <h2 className="text-2xl font-bold text-brand-red-dark">
              Presentation
            </h2>
          </div>
          <p className="leading-relaxed text-gray-700">{event.description}</p>
        </section>

        <div className="section-divider mb-10" aria-hidden="true" />

        <section className="mb-10">
          <div className="mb-3 flex items-center gap-3">
            <div className="h-8 w-1.5 rounded-full bg-brand-red" aria-hidden="true" />
            <h2 className="text-2xl font-bold text-brand-red-dark">
              Nos missions
            </h2>
          </div>
          <p className="leading-relaxed text-gray-700">{event.missions}</p>
        </section>

        <div className="section-divider mb-10" aria-hidden="true" />

        {/* CTA */}
        <div className="relative overflow-hidden rounded-xl border border-gray-100 bg-surface-card p-8 text-center">
          <div
            className="absolute right-0 top-0 h-24 w-24 bg-gradient-to-bl from-brand-red/10 to-transparent"
            aria-hidden="true"
          />
          <h3 className="relative z-10 text-xl font-bold text-brand-black">
            Envie de participer ?
          </h3>
          <p className="relative z-10 mt-2 text-gray-600">
            Rejoignez notre equipe de benevoles et vivez l&apos;evenement de
            l&apos;interieur.
          </p>
          <Link href="/recrutement" className="btn-primary relative z-10 mt-4 inline-block">
            Postuler comme benevole
          </Link>
        </div>
      </article>
    </main>
  );
}
