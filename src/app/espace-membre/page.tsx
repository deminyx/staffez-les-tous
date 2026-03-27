import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  ClipboardList,
  User,
  ChevronRight,
  Bell,
  TrendingUp,
} from "lucide-react";

import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Tableau de bord",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/connexion");

  const { firstName, lastName, id: userId } = session.user;

  const [upcomingCount, pendingCount, validatedCount] = await Promise.all([
    prisma.inscription.count({
      where: {
        userId,
        event: {
          startDate: { gte: new Date() },
          status: "PUBLIE",
        },
      },
    }),
    prisma.inscription.count({
      where: {
        userId,
        status: "EN_ATTENTE",
      },
    }),
    prisma.inscription.count({
      where: {
        userId,
        status: "VALIDEE",
      },
    }),
  ]);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Welcome header */}
      <div className="relative overflow-hidden rounded-2xl bg-surface-dark p-6 md:p-8">
        <div className="diagonal-accent opacity-20" aria-hidden="true" />
        <div className="relative z-10">
          <p className="text-sm text-gray-400">Bienvenue,</p>
          <h1 className="font-display text-2xl font-black uppercase text-white md:text-3xl">
            {firstName} {lastName}
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Retrouvez ici un apercu de votre activite au sein de l&apos;association.
          </p>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-red/10 text-brand-red">
              <Calendar className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-black">{upcomingCount}</p>
              <p className="text-xs text-gray-500">Evenements a venir</p>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
              <ClipboardList className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-black">{pendingCount}</p>
              <p className="text-xs text-gray-500">Inscriptions en attente</p>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
              <TrendingUp className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-black">{validatedCount}</p>
              <p className="text-xs text-gray-500">Participations totales</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            title: "Calendrier",
            description: "Consultez les evenements a venir et inscrivez-vous.",
            href: "/espace-membre/calendrier",
            icon: Calendar,
          },
          {
            title: "Mes inscriptions",
            description: "Suivez le statut de vos inscriptions aux evenements.",
            href: "/espace-membre/inscriptions",
            icon: ClipboardList,
          },
          {
            title: "Mon profil",
            description: "Mettez a jour vos informations personnelles.",
            href: "/espace-membre/profil",
            icon: User,
          },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="card group flex items-start gap-4 p-5 transition-transform hover:-translate-y-0.5"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-red/10 text-brand-red transition-colors group-hover:bg-brand-red group-hover:text-white">
              <item.icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <h2 className="font-display text-sm font-bold text-brand-black">
                {item.title}
              </h2>
              <p className="mt-1 text-xs text-gray-500">{item.description}</p>
            </div>
            <ChevronRight
              className="mt-0.5 h-4 w-4 shrink-0 text-gray-300 transition-colors group-hover:text-brand-red"
              aria-hidden="true"
            />
          </Link>
        ))}
      </div>

      {/* Recent activity placeholder */}
      <section>
        <h2 className="mb-4 font-display text-lg font-bold text-brand-black">
          Nouveautes
        </h2>
        <div className="card flex items-center gap-4 p-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100">
            <Bell className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <p className="text-sm text-gray-500">
            Aucune nouveaute pour le moment. Les annonces et actualites de
            l&apos;association apparaitront ici.
          </p>
        </div>
      </section>
    </div>
  );
}
