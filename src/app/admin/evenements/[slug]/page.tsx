import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { EventForm } from "@/components/features/EventForm";

import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Modifier ${slug} — Administration`,
  };
}

export default async function EditEventPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user) redirect("/connexion");

  const { slug } = await params;

  const event = await prisma.event.findUnique({
    where: { slug },
  });

  if (!event) notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-black uppercase text-brand-black">
          Modifier l&apos;evenement
        </h1>
        <p className="text-sm text-gray-500">{event.title}</p>
      </div>

      <EventForm
        mode="edit"
        event={{
          id: event.id,
          title: event.title,
          slug: event.slug,
          description: event.description,
          missions: event.missions,
          location: event.location,
          startDate: event.startDate?.toISOString() ?? null,
          endDate: event.endDate?.toISOString() ?? null,
          type: event.type,
          status: event.status,
          coverImage: event.coverImage,
          maxVolunteers: event.maxVolunteers,
          inscriptionOpen: event.inscriptionOpen,
        }}
      />
    </div>
  );
}
