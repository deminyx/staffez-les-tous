import type { Metadata } from "next";
import { Mail, Facebook, Instagram, Twitter, ExternalLink } from "lucide-react";

import { CONTACT_EMAIL, COMMUNICATION_EMAIL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact et reseaux sociaux",
  description:
    "Contactez Staffez Les Tous par email ou retrouvez-nous sur les reseaux sociaux.",
};

const SOCIALS = [
  {
    name: "Facebook",
    icon: Facebook,
    href: "https://www.facebook.com/staffezlestous",
    handle: "@staffezlestous",
    color: "bg-blue-600",
  },
  {
    name: "Instagram",
    icon: Instagram,
    href: "https://www.instagram.com/staffezlestous",
    handle: "@staffezlestous",
    color: "bg-pink-600",
  },
  {
    name: "Twitter / X",
    icon: Twitter,
    href: "https://twitter.com/staffezlestous",
    handle: "@staffezlestous",
    color: "bg-sky-500",
  },
];

const EMAIL_CONTACTS = [
  {
    label: "Contact general",
    email: CONTACT_EMAIL,
    description: "Pour toute question ou demande d'information.",
  },
  {
    label: "Pole communication",
    email: COMMUNICATION_EMAIL,
    description: "Pour les demandes presse, partenariats media et visuels.",
  },
];

export default function ContactPage() {
  return (
    <main id="main-content">
      {/* Header bandeau */}
      <section className="section-header text-center">
        <h1 className="text-4xl font-black uppercase md:text-5xl">Contact</h1>
        <p className="mx-auto mt-4 max-w-2xl text-white/80">
          Une question ? Une envie de collaborer ? Retrouvez-nous en ligne ou
          ecrivez-nous directement.
        </p>
      </section>

      {/* ─── Emails (dark section) ───────────────────────── */}
      <div className="section-divider-wide" aria-hidden="true" />

      <section className="section-dark py-16">
        <div className="diagonal-accent opacity-20" aria-hidden="true" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 md:px-6 lg:px-8">
          <div className="section-divider mb-8 opacity-60" aria-hidden="true" />
          <h2 className="mb-4 text-center text-3xl font-black uppercase md:text-4xl">
            Nous ecrire
          </h2>
          <p className="mx-auto mb-10 max-w-md text-center text-gray-400">
            Choisissez le bon interlocuteur pour votre demande.
          </p>

          <div className="grid gap-6 sm:grid-cols-2">
            {EMAIL_CONTACTS.map((contact) => (
              <a
                key={contact.email}
                href={`mailto:${contact.email}`}
                className="group relative flex items-start gap-4 overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-brand-red/50 hover:bg-white/10"
              >
                {/* Corner accent */}
                <div
                  className="absolute right-0 top-0 h-12 w-12 bg-gradient-to-bl from-brand-red/20 to-transparent transition-all group-hover:h-16 group-hover:w-16 group-hover:from-brand-red/40"
                  aria-hidden="true"
                />
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-red/20 text-brand-red-vivid">
                  <Mail className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-white">
                    {contact.label}
                  </h3>
                  <p className="mt-1 text-sm text-brand-red-vivid">
                    {contact.email}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    {contact.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider-wide" aria-hidden="true" />

      {/* ─── Reseaux sociaux ─────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-4 py-16 md:px-6 lg:px-8">
        <div className="section-divider mb-8" aria-hidden="true" />
        <h2 className="mb-4 text-center text-3xl font-black uppercase text-brand-red-dark md:text-4xl">
          Nos reseaux sociaux
        </h2>
        <p className="mx-auto mb-10 max-w-md text-center text-gray-500">
          Suivez nos aventures et rejoignez la communaute.
        </p>

        <div className="grid gap-6 sm:grid-cols-3">
          {SOCIALS.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="card group relative flex items-center gap-4 overflow-hidden p-6 transition-transform hover:-translate-y-1"
            >
              {/* Hover red bar at top */}
              <div
                className="absolute left-0 top-0 h-1 w-0 bg-brand-red transition-all duration-300 group-hover:w-full"
                aria-hidden="true"
              />
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-white ${social.color}`}
              >
                <social.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-display text-sm font-bold text-brand-black">
                  {social.name}
                </h3>
                <span className="flex items-center gap-1 text-xs text-gray-500 transition-colors group-hover:text-brand-red">
                  {social.handle}
                  <ExternalLink
                    className="h-3 w-3"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ─── CTA section ─────────────────────────────────── */}
      <div className="section-divider-wide" aria-hidden="true" />

      <section className="relative overflow-hidden bg-brand-red px-6 py-14 text-center text-white">
        <div
          className="pointer-events-none absolute right-0 top-0 h-40 w-40 md:h-56 md:w-56"
          style={{
            background:
              "linear-gradient(225deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 50%, transparent 50%)",
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute bottom-0 left-0 h-28 w-28 md:h-40 md:w-40"
          style={{
            background:
              "linear-gradient(45deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.06) 50%, transparent 50%)",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10">
          <h2 className="text-2xl font-black uppercase text-white md:text-3xl">
            Envie de nous rejoindre ?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-white/80">
            Nous recherchons en permanence des benevoles motives.
          </p>
          <a
            href="/recrutement"
            className="mt-6 inline-block rounded-lg bg-white px-8 py-3 font-semibold text-brand-red shadow-lg transition-all hover:bg-gray-100 hover:shadow-xl"
          >
            Postuler maintenant
          </a>
        </div>
      </section>
    </main>
  );
}
