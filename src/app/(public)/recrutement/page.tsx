import type { Metadata } from "next";
import { ClipboardList, UserCheck, CalendarCheck, Star, Users, Heart, Zap } from "lucide-react";

import { RecrutementForm } from "@/components/features/RecrutementForm";

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

const PERKS = [
  {
    icon: Users,
    title: "Une equipe soudee",
    description:
      "Rejoignez une communaute de passionnes ou chaque membre compte.",
  },
  {
    icon: Heart,
    title: "Des experiences uniques",
    description:
      "Vivez les evenements de l'interieur : backstage, rencontres, ambiance.",
  },
  {
    icon: Zap,
    title: "Des competences valorisantes",
    description:
      "Logistique, accueil, coordination... des savoir-faire utiles partout.",
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

      {/* ─── Pourquoi nous rejoindre (dark section) ──────── */}
      <div className="section-divider-wide" aria-hidden="true" />

      <section className="section-dark py-16">
        <div className="diagonal-accent opacity-20" aria-hidden="true" />

        <div className="relative z-10 mx-auto max-w-5xl px-4 md:px-6 lg:px-8">
          <div className="section-divider mb-8 opacity-60" aria-hidden="true" />
          <h2 className="mb-4 text-center text-3xl font-black uppercase md:text-4xl">
            Pourquoi nous rejoindre ?
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-center text-gray-400">
            Bien plus qu&apos;un engagement benevole, une aventure humaine.
          </p>

          <div className="grid gap-6 sm:grid-cols-3">
            {PERKS.map((perk) => (
              <div
                key={perk.title}
                className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-brand-red/50 hover:bg-white/10"
              >
                <div
                  className="absolute right-0 top-0 h-12 w-12 bg-gradient-to-bl from-brand-red/20 to-transparent transition-all group-hover:h-16 group-hover:w-16 group-hover:from-brand-red/40"
                  aria-hidden="true"
                />
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-red/20 text-brand-red-vivid">
                  <perk.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="font-display text-lg font-bold text-white">
                  {perk.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">
                  {perk.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider-wide" aria-hidden="true" />

      {/* ─── Processus en etapes ─────────────────────────── */}
      <section className="mx-auto max-w-4xl px-4 py-16 md:px-6 lg:px-8">
        <div className="section-divider mb-8" aria-hidden="true" />
        <h2 className="mb-4 text-center text-3xl font-black uppercase text-brand-red-dark md:text-4xl">
          Comment ca marche ?
        </h2>
        <p className="mx-auto mb-10 max-w-xl text-center text-gray-500">
          Un processus simple et bienveillant, en quatre etapes.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {STEPS.map((step, index) => (
            <div
              key={step.title}
              className="card group relative flex gap-4 overflow-hidden p-6"
            >
              {/* Step number background accent */}
              <div
                className="absolute -right-3 -top-3 font-display text-8xl font-black text-brand-red/5"
                aria-hidden="true"
              >
                {index + 1}
              </div>

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-red/10 text-brand-red transition-colors group-hover:bg-brand-red group-hover:text-white">
                <step.icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <div className="relative z-10">
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

      {/* ─── Red divider ─────────────────────────────────── */}
      <div className="section-divider-wide" aria-hidden="true" />

      {/* ─── Formulaire de recrutement ───────────────────── */}
      <section className="relative overflow-hidden bg-surface-card py-16">
        {/* Decorative diagonal */}
        <div
          className="pointer-events-none absolute right-0 top-0 h-40 w-40 opacity-[0.04] md:h-56 md:w-56"
          style={{
            background:
              "linear-gradient(135deg, transparent 50%, #b91c1c 50%)",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto max-w-2xl px-4 md:px-6 lg:px-8">
          <div className="section-divider mb-8" aria-hidden="true" />
          <h2 className="mb-2 text-center text-3xl font-black uppercase text-brand-red-dark md:text-4xl">
            Postuler
          </h2>
          <p className="mx-auto mb-10 max-w-md text-center text-sm text-gray-500">
            Remplissez ce formulaire et nous vous recontacterons rapidement.
          </p>

          <RecrutementForm />
        </div>
      </section>
    </main>
  );
}
