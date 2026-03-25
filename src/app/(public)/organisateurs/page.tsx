import type { Metadata } from "next";
import { Handshake, MessageSquare, FileCheck, Rocket } from "lucide-react";

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

      {/* Avantages */}
      <section className="mx-auto max-w-4xl px-4 py-12 md:px-6 lg:px-8">
        <h2 className="mb-8 text-center text-3xl font-bold text-brand-red-dark">
          Pourquoi nous choisir ?
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {BENEFITS.map((benefit) => (
            <li
              key={benefit}
              className="flex items-start gap-2 rounded-lg border border-gray-100 bg-white p-4 text-sm text-gray-700 shadow-sm"
            >
              <span
                className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-brand-red"
                aria-hidden="true"
              />
              {benefit}
            </li>
          ))}
        </ul>
      </section>

      {/* Processus */}
      <section className="bg-surface-card py-12">
        <div className="mx-auto max-w-4xl px-4 md:px-6 lg:px-8">
          <h2 className="mb-8 text-center text-3xl font-bold text-brand-red-dark">
            Comment ca fonctionne ?
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {PROCESS_STEPS.map((step) => (
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
        </div>
      </section>

      {/* Formulaire organisateurs */}
      <section className="mx-auto max-w-2xl px-4 py-12 md:px-6 lg:px-8">
        <h2 className="mb-8 text-center text-3xl font-bold text-brand-red-dark">
          Nous contacter
        </h2>

        <form className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="orgName"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Nom de l&apos;organisation *
              </label>
              <input
                type="text"
                id="orgName"
                name="orgName"
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-1"
                placeholder="Votre structure"
              />
            </div>
            <div>
              <label
                htmlFor="eventName"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Nom de l&apos;evenement *
              </label>
              <input
                type="text"
                id="eventName"
                name="eventName"
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-1"
                placeholder="Nom de votre evenement"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="orgFirstName"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Prenom du contact *
              </label>
              <input
                type="text"
                id="orgFirstName"
                name="firstName"
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-1"
                placeholder="Votre prenom"
              />
            </div>
            <div>
              <label
                htmlFor="orgLastName"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Nom du contact *
              </label>
              <input
                type="text"
                id="orgLastName"
                name="lastName"
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-1"
                placeholder="Votre nom"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="orgEmail"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Adresse e-mail *
            </label>
            <input
              type="email"
              id="orgEmail"
              name="email"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-1"
              placeholder="contact@votre-evenement.com"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="orgPhone"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Telephone
              </label>
              <input
                type="tel"
                id="orgPhone"
                name="phone"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-1"
                placeholder="06 12 34 56 78"
              />
            </div>
            <div>
              <label
                htmlFor="eventDates"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Dates de l&apos;evenement
              </label>
              <input
                type="text"
                id="eventDates"
                name="eventDates"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-1"
                placeholder="Ex : 15-17 novembre 2025"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="orgMessage"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Description de votre besoin *
            </label>
            <textarea
              id="orgMessage"
              name="message"
              required
              rows={5}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-1"
              placeholder="Decrivez votre evenement, le nombre de benevoles souhaites, les missions envisagees..."
            />
          </div>

          <p className="text-xs text-gray-500">
            * Champs obligatoires. Vos donnees sont utilisees uniquement pour
            traiter votre demande de partenariat.
          </p>

          <button type="submit" className="btn-primary w-full py-3 text-base">
            Envoyer la demande
          </button>
        </form>
      </section>
    </main>
  );
}
