import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, Calendar, FileText, ClipboardList, ChevronRight, Shield } from "lucide-react";

import { prisma } from "@/lib/prisma";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Administration — Staffez Les Tous",
};

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/connexion");

  const { firstName, lastName } = session.user;

  // Fetch stats
  const [userCount, publishedEventCount, pendingPublicationCount, pendingInscriptionCount] =
    await Promise.all([
      prisma.user.count({ where: { isActive: true } }),
      prisma.event.count({ where: { status: "PUBLIE" } }),
      prisma.publication.count({ where: { status: "EN_ATTENTE" } }),
      prisma.inscription.count({ where: { status: "EN_ATTENTE" } }),
    ]);

  const stats = [
    {
      label: "Adherents actifs",
      value: userCount,
      icon: Users,
      color: "bg-brand-red/10 text-brand-red",
    },
    {
      label: "Evenements publies",
      value: publishedEventCount,
      icon: Calendar,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Publications en attente",
      value: pendingPublicationCount,
      icon: FileText,
      color: "bg-amber-100 text-amber-600",
    },
    {
      label: "Inscriptions en attente",
      value: pendingInscriptionCount,
      icon: ClipboardList,
      color: "bg-green-100 text-green-600",
    },
  ];

  const quickLinks = [
    {
      title: "Utilisateurs",
      description: "Gerer les adherents, attribuer les roles.",
      href: "/admin/utilisateurs",
      icon: Users,
    },
    {
      title: "Evenements",
      description: "Creer et gerer les evenements, ouvrir les inscriptions.",
      href: "/admin/evenements",
      icon: Calendar,
    },
    {
      title: "Publications",
      description: "Valider ou rejeter les publications soumises.",
      href: "/admin/publications",
      icon: FileText,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Welcome header */}
      <div className="relative overflow-hidden rounded-2xl bg-surface-dark p-6 md:p-8">
        <div className="diagonal-accent opacity-20" aria-hidden="true" />
        <div className="relative z-10">
          <div className="mb-2 flex items-center gap-2">
            <Shield className="h-5 w-5 text-brand-red" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-red">
              Administration
            </span>
          </div>
          <p className="text-sm text-gray-400">Bienvenue,</p>
          <h1 className="font-display text-2xl font-black uppercase text-white md:text-3xl">
            {firstName} {lastName}
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Gerez le site, les adherents et les evenements depuis cet espace.
          </p>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-5">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}
              >
                <stat.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-2xl font-bold text-brand-black">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quickLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="card group flex items-start gap-4 p-5 transition-transform hover:-translate-y-0.5"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-red/10 text-brand-red transition-colors group-hover:bg-brand-red group-hover:text-white">
              <item.icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <h2 className="font-display text-sm font-bold text-brand-black">{item.title}</h2>
              <p className="mt-1 text-xs text-gray-500">{item.description}</p>
            </div>
            <ChevronRight
              className="mt-0.5 h-4 w-4 shrink-0 text-gray-300 transition-colors group-hover:text-brand-red"
              aria-hidden="true"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
