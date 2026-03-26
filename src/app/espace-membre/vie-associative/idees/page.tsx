import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { IdeaCard } from "@/components/features/IdeaCard";
import { IdeaForm } from "@/components/features/IdeaForm";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Boite a idees | Vie associative | Staffez Les Tous",
};

export default async function IdeesPage() {
  const session = await auth();
  if (!session?.user) redirect("/connexion");

  const ideas = await prisma.idea.findMany({
    where: { isApproved: true },
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { firstName: true, lastName: true } },
      likes: { select: { userId: true } },
    },
  });

  const ideasWithMeta = ideas.map((idea) => ({
    id: idea.id,
    title: idea.title,
    description: idea.description,
    authorName: `${idea.author.firstName} ${idea.author.lastName}`,
    likeCount: idea.likes.length,
    isLiked: idea.likes.some((l) => l.userId === session.user.id),
    createdAt: idea.createdAt.toISOString(),
  }));

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-2xl font-black uppercase tracking-wider text-brand-black">
          Boite a idees
        </h1>
      </div>

      {/* Submit form */}
      <IdeaForm />

      {/* Ideas list */}
      {ideasWithMeta.length === 0 ? (
        <div className="card mt-6 p-12 text-center">
          <p className="text-gray-500">
            Aucune idee pour le moment. Soyez le premier a en proposer !
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {ideasWithMeta.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      )}
    </div>
  );
}
