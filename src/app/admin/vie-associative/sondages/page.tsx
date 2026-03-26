import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole } from "@/lib/permissions";
import { PollForm } from "@/components/features/PollForm";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gestion sondages | Admin | Staffez Les Tous",
};

export default async function AdminSondagesPage() {
  const session = await auth();
  if (!session?.user) redirect("/connexion");
  requireAuth(session);
  requireRole(session, ["ADMINISTRATEUR", "DEVELOPPEUR"]);

  const polls = await prisma.poll.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      options: {
        include: {
          _count: { select: { votes: true } },
        },
      },
    },
  });

  return (
    <div>
      <h1 className="mb-8 font-display text-2xl font-black uppercase tracking-wider text-brand-black">
        Gestion des sondages
      </h1>

      {/* Create form */}
      <PollForm />

      {/* Existing polls */}
      <div className="mt-8 space-y-4">
        {polls.map((poll) => {
          const isClosed = new Date() > new Date(poll.closesAt);
          const totalVotes = poll.options.reduce((sum, o) => sum + o._count.votes, 0);

          return (
            <div key={poll.id} className="card p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display text-sm font-bold uppercase tracking-wider text-brand-black">
                    {poll.question}
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">
                    {isClosed ? "Cloture" : "En cours"} —{" "}
                    {new Date(poll.closesAt).toLocaleDateString("fr-FR")} — {totalVotes} vote
                    {totalVotes > 1 ? "s" : ""}
                  </p>
                </div>
                <span
                  className={
                    isClosed
                      ? "rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-500"
                      : "rounded-full bg-green-50 px-2 py-1 text-xs text-green-600"
                  }
                >
                  {isClosed ? "Termine" : "Actif"}
                </span>
              </div>

              <div className="mt-4 space-y-2">
                {poll.options.map((option) => {
                  const pct =
                    totalVotes > 0 ? Math.round((option._count.votes / totalVotes) * 100) : 0;
                  return (
                    <div
                      key={option.id}
                      className="relative overflow-hidden rounded-lg border border-gray-100 p-2 text-sm"
                    >
                      <div className="absolute inset-0 bg-gray-50" style={{ width: `${pct}%` }} />
                      <span className="relative flex justify-between text-gray-600">
                        <span>{option.label}</span>
                        <span className="text-xs text-gray-500">
                          {option._count.votes} ({pct}%)
                        </span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
