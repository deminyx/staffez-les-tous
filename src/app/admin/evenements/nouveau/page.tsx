import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

import { EventForm } from "@/components/features/EventForm";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nouvel evenement — Administration",
};

export default async function NewEventPage() {
  const session = await auth();
  if (!session?.user) redirect("/connexion");

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-black uppercase text-brand-black">
          Nouvel evenement
        </h1>
        <p className="text-sm text-gray-500">
          Remplissez les informations pour creer un nouvel evenement.
        </p>
      </div>

      <EventForm mode="create" />
    </div>
  );
}
