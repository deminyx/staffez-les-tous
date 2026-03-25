import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

import { ProfileForm } from "@/components/features/ProfileForm";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mon profil",
};

export default async function ProfilPage() {
  const session = await auth();
  if (!session?.user) redirect("/connexion");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      username: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      bio: true,
      allergies: true,
      photo: true,
      createdAt: true,
      inscriptions: {
        where: { status: "VALIDEE" },
        include: {
          event: {
            select: {
              title: true,
              startDate: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!user) redirect("/connexion");

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-black uppercase text-brand-black md:text-3xl">
          Mon profil
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Gerez vos informations personnelles
        </p>
      </div>

      <div className="section-divider" aria-hidden="true" />

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Readonly info card */}
        <div className="lg:col-span-1">
          <div className="card space-y-4 p-6">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-red/10">
              <span className="font-display text-2xl font-black text-brand-red">
                {user.firstName.charAt(0)}
                {user.lastName.charAt(0)}
              </span>
            </div>

            <div className="text-center">
              <p className="font-display font-bold text-brand-black">
                {user.firstName} {user.lastName}
              </p>
              <p className="mt-0.5 text-sm text-gray-500">@{user.username}</p>
            </div>

            <div className="space-y-2 border-t border-gray-100 pt-4 text-sm">
              <div>
                <span className="text-xs font-medium text-gray-400">Email</span>
                <p className="text-gray-700">{user.email}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-400">
                  Membre depuis
                </span>
                <p className="text-gray-700">
                  {new Intl.DateTimeFormat("fr-FR", {
                    month: "long",
                    year: "numeric",
                  }).format(user.createdAt)}
                </p>
              </div>
            </div>

            <p className="border-t border-gray-100 pt-4 text-xs text-gray-400">
              Les champs nom, prenom, identifiant et email sont modifiables
              uniquement par un administrateur.
            </p>
          </div>
        </div>

        {/* Editable form */}
        <div className="lg:col-span-2">
          <ProfileForm
            phone={user.phone ?? ""}
            bio={user.bio ?? ""}
            allergies={user.allergies ?? ""}
          />

          {/* Participation history */}
          <section className="mt-8">
            <h2 className="mb-4 font-display text-lg font-bold text-brand-black">
              Historique des participations
            </h2>

            {user.inscriptions.length === 0 ? (
              <div className="card p-6 text-center">
                <p className="text-sm text-gray-500">
                  Aucune participation enregistree pour le moment.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {user.inscriptions.map((ins) => (
                  <div key={ins.id} className="card flex items-center gap-3 px-4 py-3">
                    <div className="h-2 w-2 shrink-0 rounded-full bg-green-500" aria-hidden="true" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-brand-black">
                        {ins.event.title}
                      </p>
                    </div>
                    {ins.event.startDate && (
                      <span className="shrink-0 text-xs text-gray-400">
                        {new Intl.DateTimeFormat("fr-FR", {
                          month: "short",
                          year: "numeric",
                        }).format(ins.event.startDate)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
