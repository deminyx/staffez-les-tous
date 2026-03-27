import type { Metadata } from "next";
import {
  Handshake,
  MessageSquare,
  FileCheck,
  Rocket,
  Check,
} from "lucide-react";

import { OrganisateursForm } from "@/components/features/OrganisateursForm";

export const metadata: Metadata = {
  title: "Organisateurs — Faire appel a nos benevoles",
  description:
    "Vous organisez un evenement manga, gaming ou pop culture ? Staffez Les Tous met a votre disposition une equipe de benevoles formes et motives.",
};

const PROCESS_STEPS = [
  {
    icon: MessageSquare,
    title: "1. Prise de contact",
    description:
      "Remplissez le formulaire ci-dessous ou contactez-nous par email. Decrivez votre evenement, les dates et vos besoins en benevoles.",
  },
  {
    icon: FileCheck,
    title: "2. Etude du projet",
    description:
      "Notre coordinateur analyse votre demande et elabore une proposition adaptee : nombre de benevoles, postes, planning, logistique.",
  },
  {
    icon: Handshake,
    title: "3. Convention",
    description:
      "Une convention de partenariat est signee entre nos deux structures. Elle definit les engagements mutuels, les conditions et le cadre de l'intervention.",
  },
  {
    icon: Rocket,
    title: "4. Jour J",
    description:
      "Notre equipe est briefee et operationnelle. Un referent Staffez Les Tous est present sur site pour coordonner les benevoles et assurer la liaison avec votre equipe.",
  },
];

const BENEFITS = [
  "Equipe formee et briefee avant chaque evenement",
  "Referent dedie pour la coordination sur site",
  "Flexibilite : de 5 a 50+ benevoles selon vos besoins",
  "Experience dans les conventions manga, gaming et pop culture",
  "Convention de partenariat claire et transparente",
  "Retour d'experience post-evenement",
];

export default function OrganisateursPage() {
  return (
    <main id="main-content">
      {/* Header bandeau */}
      <section className="section-header text-center">
        <h1 className="text-4xl font-black uppercase md:text-5xl">
          Organisateurs
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-white/80">
          Vous organisez un evenement ? Faites appel a nos equipes de
          benevoles formes et passionnes.
        </p>
      </section>

      {/* ─── Avantages (dark section for visual rhythm) ──── */}
      <div className="section-divider-wide" aria-hidden="true" />

      <section className="section-dark py-16">
        <div className="diagonal-accent opacity-20" aria-hidden="true" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 md:px-6 lg:px-8">
          <div className="section-divider mb-8 opacity-60" aria-hidden="true" />
          <h2 className="mb-4 text-center text-3xl font-black uppercase md:text-4xl">
            Pourquoi nous choisir ?
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-center text-gray-400">
            Une equipe fiable et experimentee, dediee a la reussite de votre
            evenement.
          </p>

          <ul className="grid gap-4 sm:grid-cols-2">
            {BENEFITS.map((benefit) => (
              <li
                key={benefit}
                className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-5 text-sm text-gray-300 backdrop-blur-sm transition-all hover:border-brand-red/30 hover:bg-white/10"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-red/20">
                  <Check
                    className="h-3 w-3 text-brand-red-vivid"
                    aria-hidden="true"
                  />
                </span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="section-divider-wide" aria-hidden="true" />

      {/* ─── Processus ───────────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-4 py-16 md:px-6 lg:px-8">
        <div className="section-divider mb-8" aria-hidden="true" />
        <h2 className="mb-4 text-center text-3xl font-black uppercase text-brand-red-dark md:text-4xl">
          Comment ca fonctionne ?
        </h2>
        <p className="mx-auto mb-10 max-w-xl text-center text-gray-500">
          De la prise de contact au jour J, un accompagnement sur mesure.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {PROCESS_STEPS.map((step, index) => (
            <div
              key={step.title}
              className="card group relative flex gap-4 overflow-hidden p-6"
            >
              {/* Step number watermark */}
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

      {/* ─── Formulaire organisateurs ────────────────────── */}
      <section className="relative overflow-hidden bg-surface-card py-16">
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
            Nous contacter
          </h2>
          <p className="mx-auto mb-10 max-w-md text-center text-sm text-gray-500">
            Decrivez votre projet et nous reviendrons vers vous sous 48h.
          </p>

          <OrganisateursForm />
        </div>
      </section>
    </main>
  );
}
