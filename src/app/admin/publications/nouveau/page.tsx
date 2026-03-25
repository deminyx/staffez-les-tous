import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

import { PublicationForm } from "@/components/features/PublicationForm";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nouvelle publication — Administration",
};

export default async function NewPublicationPage() {
  const session = await auth();
  if (!session?.user) redirect("/connexion");

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-black uppercase text-brand-black">
          Nouvelle publication
        </h1>
        <p className="text-sm text-gray-500">
          Redigez votre contenu. Vous pourrez le soumettre pour validation apres enregistrement.
        </p>
      </div>

      <PublicationForm mode="create" currentUserId={session.user.id} />
    </div>
  );
}
