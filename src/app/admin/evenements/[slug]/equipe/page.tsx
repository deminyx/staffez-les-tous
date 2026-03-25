import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { InscriptionRow } from "@/components/features/InscriptionRow";

import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Equipe ${slug} — Administration`,
  };
}

export default async function TeamPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user) redirect("/connexion");

  const { slug } = await params;

  const event = await prisma.event.findUnique({
    where: { slug },
    include: {
      inscriptions: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              username: true,
              email: true,
              phone: true,
            },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!event) notFound();

  const inscriptions = event.inscriptions.map((ins) => ({
    id: ins.id,
    userId: ins.user.id,
    firstName: ins.user.firstName,
    lastName: ins.user.lastName,
    username: ins.user.username,
    status: ins.status,
    position: ins.position,
    schedule: ins.schedule,
    notes: ins.notes,
    createdAt: ins.createdAt.toISOString(),
  }));

  const validatedCount = inscriptions.filter((i) => i.status === "VALIDEE").length;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/admin/evenements"
            className="mb-2 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-red"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Evenements
          </Link>
          <h1 className="font-display text-2xl font-black uppercase text-brand-black">
            Equipe — {event.title}
          </h1>
          <p className="text-sm text-gray-500">
            {event.startDate && formatDate(new Date(event.startDate))}
            {event.endDate && ` — ${formatDate(new Date(event.endDate))}`}
            {event.location && ` • ${event.location}`}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-2xl font-bold text-brand-black">
              {validatedCount}
              {event.maxVolunteers ? ` / ${event.maxVolunteers}` : ""}
            </p>
            <p className="text-xs text-gray-500">Benevoles valides</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th scope="col" className="px-4 py-3 text-left font-semibold text-gray-600">
                  Benevole
                </th>
                <th
                  scope="col"
                  className="hidden px-4 py-3 text-left font-semibold text-gray-600 md:table-cell"
                >
                  Date inscription
                </th>
                <th scope="col" className="px-4 py-3 text-left font-semibold text-gray-600">
                  Statut
                </th>
                <th
                  scope="col"
                  className="hidden px-4 py-3 text-left font-semibold text-gray-600 lg:table-cell"
                >
                  Poste
                </th>
                <th
                  scope="col"
                  className="hidden px-4 py-3 text-left font-semibold text-gray-600 lg:table-cell"
                >
                  Horaires
                </th>
                <th scope="col" className="px-4 py-3 text-right font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {inscriptions.map((inscription) => (
                <InscriptionRow key={inscription.id} inscription={inscription} />
              ))}
              {inscriptions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    Aucune inscription pour cet evenement.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
