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

      <div className="mx-auto max-w-4xl px-4 py-12 md:px-6 lg:px-8">
        {/* Emails */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-brand-red-dark">
            Nous ecrire
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {EMAIL_CONTACTS.map((contact) => (
              <a
                key={contact.email}
                href={`mailto:${contact.email}`}
                className="card flex items-start gap-4 p-6 transition-transform hover:-translate-y-0.5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-red/10 text-brand-red">
                  <Mail className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-brand-black">
                    {contact.label}
                  </h3>
                  <p className="mt-1 text-sm text-brand-red">{contact.email}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {contact.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Reseaux sociaux */}
        <section>
          <h2 className="mb-6 text-2xl font-bold text-brand-red-dark">
            Nos reseaux sociaux
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {SOCIALS.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="card flex items-center gap-4 p-6 transition-transform hover:-translate-y-0.5"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white ${social.color}`}
                >
                  <social.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-brand-black">
                    {social.name}
                  </h3>
                  <span className="flex items-center gap-1 text-xs text-gray-500">
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
      </div>
    </main>
  );
}
