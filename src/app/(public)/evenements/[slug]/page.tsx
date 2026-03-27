import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, MapPin, ArrowLeft, Users } from "lucide-react";

import { prisma } from "@/lib/prisma";

interface EvenementDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const events = await prisma.event.findMany({
      where: { status: "PUBLIE", type: "PRESTATION" },
      select: { slug: true },
    });
    return events.map((e) => ({ slug: e.slug }));
  } catch {
    // DB indisponible au build (ex: CI/CD sans DATABASE_URL)
    return [];
  }
}

export async function generateMetadata({ params }: EvenementDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await prisma.event.findUnique({
    where: { slug },
    select: { title: true, description: true },
  });
  if (!event) {
    return { title: "Evenement introuvable" };
  }
  return {
    title: event.title,
    description: event.description.slice(0, 160),
  };
}

export default async function EvenementDetailPage({ params }: EvenementDetailPageProps) {
  const { slug } = await params;

  const event = await prisma.event.findUnique({
    where: { slug, status: "PUBLIE", type: "PRESTATION" },
    select: {
      title: true,
      description: true,
      missions: true,
      location: true,
      startDate: true,
      endDate: true,
      maxVolunteers: true,
    },
  });

  if (!event) {
    notFound();
  }

  const dateLabel = (() => {
    if (!event.startDate) return null;
    const start = new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(event.startDate));
    if (!event.endDate) return start;
    const end = new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(event.endDate));
    return `${start} — ${end}`;
  })();

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
          <h1 className="text-3xl font-black uppercase md:text-5xl">{event.title}</h1>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/80">
            {dateLabel && (
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" aria-hidden="true" />
                {dateLabel}
              </span>
            )}
            {event.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {event.location}
              </span>
            )}
            {event.maxVolunteers && (
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" aria-hidden="true" />
                {event.maxVolunteers} benevoles
              </span>
            )}
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
            <h2 className="text-2xl font-bold text-brand-red-dark">Presentation</h2>
          </div>
          <p className="leading-relaxed text-gray-700">{event.description}</p>
        </section>

        {event.missions && (
          <>
            <div className="section-divider mb-10" aria-hidden="true" />
            <section className="mb-10">
              <div className="mb-3 flex items-center gap-3">
                <div className="h-8 w-1.5 rounded-full bg-brand-red" aria-hidden="true" />
                <h2 className="text-2xl font-bold text-brand-red-dark">Nos missions</h2>
              </div>
              <p className="leading-relaxed text-gray-700">{event.missions}</p>
            </section>
          </>
        )}

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
            Rejoignez notre equipe de benevoles et vivez l&apos;evenement de l&apos;interieur.
          </p>
          <Link href="/recrutement" className="btn-primary relative z-10 mt-4 inline-block">
            Postuler comme benevole
          </Link>
        </div>
      </article>
    </main>
  );
}
