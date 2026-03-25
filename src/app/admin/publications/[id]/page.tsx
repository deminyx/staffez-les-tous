import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { PublicationForm } from "@/components/features/PublicationForm";
import { ValidationPanel } from "@/components/features/ValidationPanel";

import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Publication ${id} — Administration`,
  };
}

export default async function EditPublicationPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user) redirect("/connexion");

  const { id } = await params;

  const publication = await prisma.publication.findUnique({
    where: { id },
    include: {
      author: { select: { firstName: true, lastName: true } },
      validator: { select: { firstName: true, lastName: true } },
    },
  });

  if (!publication) notFound();

  // Check access: admins see all, editors see their own
  const isAdmin = session.user.roles?.some(
    (r: { role: string }) => r.role === "ADMINISTRATEUR" || r.role === "DEVELOPPEUR",
  );

  if (!isAdmin && publication.authorId !== session.user.id) {
    redirect("/admin/publications");
  }

  const showValidation = isAdmin && publication.status === "EN_ATTENTE";

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-black uppercase text-brand-black">
          {publication.title}
        </h1>
        <p className="text-sm text-gray-500">
          Par {publication.author.firstName} {publication.author.lastName}
          {publication.validationComment && (
            <span className="ml-2 text-amber-600">
              — Commentaire : {publication.validationComment}
            </span>
          )}
        </p>
      </div>

      {showValidation && <ValidationPanel publicationId={publication.id} />}

      <PublicationForm
        mode="edit"
        publication={{
          id: publication.id,
          title: publication.title,
          content: publication.content,
          category: publication.category,
          coverImage: publication.coverImage,
          status: publication.status,
          authorId: publication.authorId,
        }}
        currentUserId={session.user.id}
      />
    </div>
  );
}
