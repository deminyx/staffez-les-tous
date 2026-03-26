import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole } from "@/lib/permissions";
import { IdeaModerationRow } from "@/components/features/IdeaModerationRow";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Moderation idees | Admin | Staffez Les Tous",
};

export default async function AdminIdeesPage() {
  const session = await auth();
  if (!session?.user) redirect("/connexion");
  requireAuth(session);
  requireRole(session, ["ADMINISTRATEUR", "DEVELOPPEUR"]);

  const ideas = await prisma.idea.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { firstName: true, lastName: true } },
      _count: { select: { likes: true } },
    },
  });

  const pendingIdeas = ideas.filter((i) => !i.isApproved);
  const approvedIdeas = ideas.filter((i) => i.isApproved);

  return (
    <div>
      <h1 className="mb-8 font-display text-2xl font-black uppercase tracking-wider text-white">
        Moderation des idees
      </h1>

      {ideas.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-surface-dark p-12 text-center">
          <p className="text-gray-400">Aucune idee soumise.</p>
        </div>
      ) : (
        <>
          {pendingIdeas.length > 0 && (
            <section className="mb-10">
              <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-yellow-400">
                En attente de moderation ({pendingIdeas.length})
              </h2>
              <div className="space-y-3">
                {pendingIdeas.map((idea) => (
                  <IdeaModerationRow
                    key={idea.id}
                    id={idea.id}
                    title={idea.title}
                    description={idea.description}
                    authorName={`${idea.author.firstName} ${idea.author.lastName}`}
                    likeCount={idea._count.likes}
                    isApproved={idea.isApproved}
                    createdAt={idea.createdAt.toISOString()}
                  />
                ))}
              </div>
            </section>
          )}

          {approvedIdeas.length > 0 && (
            <section>
              <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-green-400">
                Approuvees ({approvedIdeas.length})
              </h2>
              <div className="space-y-3">
                {approvedIdeas.map((idea) => (
                  <IdeaModerationRow
                    key={idea.id}
                    id={idea.id}
                    title={idea.title}
                    description={idea.description}
                    authorName={`${idea.author.firstName} ${idea.author.lastName}`}
                    likeCount={idea._count.likes}
                    isApproved={idea.isApproved}
                    createdAt={idea.createdAt.toISOString()}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
