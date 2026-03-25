import type { Metadata } from "next";
import { ClipboardList, UserCheck, CalendarCheck, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "Recrutement benevoles",
  description:
    "Rejoignez Staffez Les Tous ! Decouvrez le processus de recrutement et postulez pour devenir benevole.",
};

const STEPS = [
  {
    icon: ClipboardList,
    title: "1. Candidature",
    description:
      "Remplissez le formulaire ci-dessous en indiquant vos disponibilites et les evenements qui vous interessent. Aucune experience prealable n'est requise !",
  },
  {
    icon: UserCheck,
    title: "2. Entretien",
    description:
      "Un membre de l'equipe vous contacte pour un echange informel. On discute de vos motivations, de vos envies et on repond a toutes vos questions.",
  },
  {
    icon: CalendarCheck,
    title: "3. Premier evenement",
    description:
      "Vous etes integre(e) a l'equipe d'un evenement. Un tuteur vous accompagne pour que tout se passe bien. Briefing complet avant le jour J.",
  },
  {
    icon: Star,
    title: "4. Integration",
    description:
      "Apres votre premiere experience, vous devenez membre a part entiere. Acces a l'espace adherent, au calendrier des evenements et a la vie associative.",
  },
];

export default function RecrutementPage() {
  return (
    <main id="main-content">
      {/* Header bandeau */}
      <section className="section-header text-center">
        <h1 className="text-4xl font-black uppercase md:text-5xl">
          Devenir benevole
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-white/80">
          Passionnes de manga, gaming ou pop culture ? Rejoignez une equipe
          dynamique et vivez les evenements de l&apos;interieur.
        </p>
      </section>

      {/* Processus en etapes */}
      <section className="mx-auto max-w-4xl px-4 py-12 md:px-6 lg:px-8">
        <h2 className="mb-8 text-center text-3xl font-bold text-brand-red-dark">
          Comment ca marche ?
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          {STEPS.map((step) => (
            <div
              key={step.title}
              className="card flex gap-4 p-6"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-red/10 text-brand-red">
                <step.icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-brand-black">
                  {step.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Formulaire de recrutement */}
      <section className="bg-surface-card py-12">
        <div className="mx-auto max-w-2xl px-4 md:px-6 lg:px-8">
          <h2 className="mb-8 text-center text-3xl font-bold text-brand-red-dark">
            Postuler
          </h2>

          <form className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="firstName"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Prenom *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-1"
                  placeholder="Votre prenom"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Nom *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-1"
                  placeholder="Votre nom"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Adresse e-mail *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-1"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Telephone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-1"
                placeholder="06 12 34 56 78"
              />
            </div>

            <div>
              <label
                htmlFor="events"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Evenement(s) qui vous interessent
              </label>
              <input
                type="text"
                id="events"
                name="events"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-1"
                placeholder="Ex : Art to Play, Manga City..."
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Votre message *
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-1"
                placeholder="Parlez-nous de vous, de vos motivations..."
              />
            </div>

            <p className="text-xs text-gray-500">
              * Champs obligatoires. Vos donnees sont utilisees uniquement dans
              le cadre du recrutement et ne sont pas transmises a des tiers.
            </p>

            <button type="submit" className="btn-primary w-full py-3 text-base">
              Envoyer ma candidature
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
