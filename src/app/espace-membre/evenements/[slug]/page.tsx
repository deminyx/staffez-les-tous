import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  MapPin,
  Users,
  Clock,
  FileText,
  CheckCircle,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

import { InscriptionButton } from "@/components/features/InscriptionButton";

import type { Metadata } from "next";

interface EventDetailPageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: EventDetailPageProps): Promise<Metadata> {
  const event = await prisma.event.findUnique({
    where: { slug: params.slug },
    select: { title: true },
  });

  return {
    title: event?.title ?? "Evenement",
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const session = await auth();
  if (!session?.user) redirect("/connexion");

  const event = await prisma.event.findUnique({
    where: { slug: params.slug },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      missions: true,
      coverImage: true,
      startDate: true,
      endDate: true,
      location: true,
      type: true,
      status: true,
      inscriptionOpen: true,
      maxVolunteers: true,
      _count: { select: { inscriptions: true } },
    },
  });

  if (!event || event.status !== "PUBLIE") {
    notFound();
  }

  // Verifier si l'utilisateur est deja inscrit
  const existingInscription = await prisma.inscription.findUnique({
    where: {
      userId_eventId: {
        userId: session.user.id,
        eventId: event.id,
      },
    },
    select: {
      id: true,
      status: true,
      position: true,
      schedule: true,
      notes: true,
    },
  });

  const isFull =
    event.maxVolunteers !== null &&
    event._count.inscriptions >= event.maxVolunteers;

  const spotsLeft =
    event.maxVolunteers !== null
      ? event.maxVolunteers - event._count.inscriptions
      : null;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Back link */}
      <Link
        href="/espace-membre/calendrier"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-brand-red"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Retour au calendrier
      </Link>

      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="font-display text-2xl font-black uppercase text-brand-black md:text-3xl">
            {event.title}
          </h1>
          <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
            {event.type === "PRESTATION" ? "Prestation" : "Vie asso"}
          </span>
        </div>
      </div>

      <div className="section-divider" aria-hidden="true" />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Description */}
          <div className="card p-6">
            <h2 className="mb-3 font-display text-base font-bold text-brand-black">
              Description
            </h2>
            <div className="prose prose-sm max-w-none text-gray-600">
              {event.description.split("\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Missions */}
          {event.missions && (
            <div className="card p-6">
              <h2 className="mb-3 flex items-center gap-2 font-display text-base font-bold text-brand-black">
                <FileText className="h-4 w-4 text-brand-red" aria-hidden="true" />
                Missions benevoles
              </h2>
              <div className="prose prose-sm max-w-none text-gray-600">
                {event.missions.split("\n").map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            </div>
          )}

          {/* Inscription existante — details */}
          {existingInscription && existingInscription.status === "VALIDEE" && (
            <div className="card border-green-200 bg-green-50 p-6">
              <h2 className="mb-3 flex items-center gap-2 font-display text-base font-bold text-green-800">
                <CheckCircle className="h-5 w-5 text-green-600" aria-hidden="true" />
                Votre affectation
              </h2>
              <div className="space-y-2 text-sm text-green-700">
                {existingInscription.position && (
                  <p>
                    <span className="font-medium">Poste :</span>{" "}
                    {existingInscription.position}
                  </p>
                )}
                {existingInscription.schedule && (
                  <p>
                    <span className="font-medium">Horaires :</span>{" "}
                    {existingInscription.schedule}
                  </p>
                )}
                {!existingInscription.position && !existingInscription.schedule && (
                  <p>
                    Votre inscription est validee. Les details d&apos;affectation
                    seront communiques prochainement.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4 lg:col-span-1">
          {/* Event info card */}
          <div className="card space-y-4 p-6">
            <h2 className="font-display text-base font-bold text-brand-black">
              Informations
            </h2>

            <div className="space-y-3">
              {/* Dates */}
              {event.startDate && (
                <div className="flex items-start gap-3 text-sm">
                  <CalendarIcon
                    className="mt-0.5 h-4 w-4 shrink-0 text-brand-red"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-medium text-brand-black">
                      {formatDate(event.startDate)}
                    </p>
                    {event.endDate &&
                      event.endDate.getTime() !== event.startDate.getTime() && (
                        <p className="text-gray-500">
                          au {formatDate(event.endDate)}
                        </p>
                      )}
                  </div>
                </div>
              )}

              {/* Lieu */}
              {event.location && (
                <div className="flex items-start gap-3 text-sm">
                  <MapPin
                    className="mt-0.5 h-4 w-4 shrink-0 text-brand-red"
                    aria-hidden="true"
                  />
                  <p className="text-brand-black">{event.location}</p>
                </div>
              )}

              {/* Places */}
              <div className="flex items-start gap-3 text-sm">
                <Users
                  className="mt-0.5 h-4 w-4 shrink-0 text-brand-red"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-brand-black">
                    {event._count.inscriptions} inscrit
                    {event._count.inscriptions !== 1 ? "s" : ""}
                  </p>
                  {event.maxVolunteers !== null && (
                    <p className="text-gray-500">
                      {spotsLeft !== null && spotsLeft > 0
                        ? `${spotsLeft} place${spotsLeft > 1 ? "s" : ""} restante${spotsLeft > 1 ? "s" : ""}`
                        : "Complet"}
                    </p>
                  )}
                </div>
              </div>

              {/* Statut inscriptions */}
              <div className="flex items-start gap-3 text-sm">
                <Clock
                  className="mt-0.5 h-4 w-4 shrink-0 text-brand-red"
                  aria-hidden="true"
                />
                <p className="text-brand-black">
                  {event.inscriptionOpen
                    ? "Inscriptions ouvertes"
                    : "Inscriptions fermees"}
                </p>
              </div>
            </div>
          </div>

          {/* Inscription action card */}
          <InscriptionButton
            eventId={event.id}
            inscriptionOpen={event.inscriptionOpen}
            isFull={isFull}
            existingInscription={
              existingInscription
                ? {
                    id: existingInscription.id,
                    status: existingInscription.status,
                  }
                : null
            }
          />
        </div>
      </div>
    </div>
  );
}
