import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ClipboardList, ChevronRight, MapPin } from "lucide-react";
import { formatDate } from "@/lib/utils";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mes inscriptions",
};

const STATUS_CONFIG = {
  EN_ATTENTE: {
    label: "En attente",
    className: "bg-amber-100 text-amber-700",
  },
  VALIDEE: {
    label: "Validee",
    className: "bg-green-100 text-green-700",
  },
  REFUSEE: {
    label: "Refusee",
    className: "bg-red-100 text-red-700",
  },
} as const;

export default async function InscriptionsPage() {
  const session = await auth();
  if (!session?.user) redirect("/connexion");

  const inscriptions = await prisma.inscription.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      event: {
        select: {
          title: true,
          slug: true,
          startDate: true,
          endDate: true,
          location: true,
          type: true,
        },
      },
    },
  });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-black uppercase text-brand-black md:text-3xl">
          Mes inscriptions
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Suivez le statut de vos inscriptions aux evenements
        </p>
      </div>

      <div className="section-divider" aria-hidden="true" />

      {/* Inscriptions list */}
      {inscriptions.length === 0 ? (
        <div className="card flex flex-col items-center gap-4 p-12 text-center">
          <ClipboardList className="h-12 w-12 text-gray-300" aria-hidden="true" />
          <div>
            <p className="font-display font-bold text-brand-black">
              Aucune inscription
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Inscrivez-vous a un evenement depuis le{" "}
              <Link
                href="/espace-membre/calendrier"
                className="text-brand-red hover:underline"
              >
                calendrier
              </Link>
              .
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {inscriptions.map((inscription) => {
            const config = STATUS_CONFIG[inscription.status];

            return (
              <Link
                key={inscription.id}
                href={`/espace-membre/evenements/${inscription.event.slug}`}
                className="card group block overflow-hidden p-5 transition-transform hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="truncate font-display text-base font-bold text-brand-black">
                        {inscription.event.title}
                      </h2>
                      <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}>
                        {config.label}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      {inscription.event.startDate && (
                        <span>{formatDate(inscription.event.startDate)}</span>
                      )}
                      {inscription.event.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" aria-hidden="true" />
                          {inscription.event.location}
                        </span>
                      )}
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                        {inscription.event.type === "PRESTATION" ? "Prestation" : "Vie asso"}
                      </span>
                    </div>

                    {/* Affectation si validee */}
                    {inscription.status === "VALIDEE" && (
                      <div className="mt-3 rounded-lg border border-green-200 bg-green-50 p-3">
                        <div className="flex flex-wrap gap-4 text-xs">
                          {inscription.position && (
                            <div>
                              <span className="font-medium text-green-700">Poste :</span>{" "}
                              <span className="text-green-600">{inscription.position}</span>
                            </div>
                          )}
                          {inscription.schedule && (
                            <div>
                              <span className="font-medium text-green-700">Horaires :</span>{" "}
                              <span className="text-green-600">{inscription.schedule}</span>
                            </div>
                          )}
                          {!inscription.position && !inscription.schedule && (
                            <span className="text-green-600">
                              Inscription validee — affectation a venir
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <ChevronRight
                    className="mt-1 h-4 w-4 shrink-0 text-gray-300 transition-colors group-hover:text-brand-red"
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
