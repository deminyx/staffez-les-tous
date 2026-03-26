import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PollCard } from "@/components/features/PollCard";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sondages | Vie associative | Staffez Les Tous",
};

export default async function SondagesPage() {
  const session = await auth();
  if (!session?.user) redirect("/connexion");

  const polls = await prisma.poll.findMany({
    orderBy: { closesAt: "desc" },
    include: {
      options: {
        include: {
          votes: {
            select: { userId: true },
          },
        },
      },
    },
  });

  const pollsWithMeta = polls.map((poll) => {
    const isClosed = new Date() > new Date(poll.closesAt);
    const totalVotes = poll.options.reduce((sum, o) => sum + o.votes.length, 0);
    const hasVoted = poll.options.some((o) => o.votes.some((v) => v.userId === session.user.id));

    return {
      id: poll.id,
      question: poll.question,
      closesAt: poll.closesAt.toISOString(),
      isClosed,
      hasVoted,
      totalVotes,
      options: poll.options.map((o) => ({
        id: o.id,
        label: o.label,
        voteCount: o.votes.length,
        isSelected: o.votes.some((v) => v.userId === session.user.id),
      })),
    };
  });

  const activePolls = pollsWithMeta.filter((p) => !p.isClosed);
  const closedPolls = pollsWithMeta.filter((p) => p.isClosed);

  return (
    <div>
      <h1 className="mb-8 font-display text-2xl font-black uppercase tracking-wider text-brand-black">
        Sondages
      </h1>

      {pollsWithMeta.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-gray-500">Aucun sondage pour le moment.</p>
        </div>
      ) : (
        <>
          {activePolls.length > 0 && (
            <section className="mb-10">
              <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-gray-500">
                En cours
              </h2>
              <div className="space-y-4">
                {activePolls.map((poll) => (
                  <PollCard key={poll.id} poll={poll} />
                ))}
              </div>
            </section>
          )}

          {closedPolls.length > 0 && (
            <section>
              <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-gray-500">
                Clotures
              </h2>
              <div className="space-y-4">
                {closedPolls.map((poll) => (
                  <PollCard key={poll.id} poll={poll} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
