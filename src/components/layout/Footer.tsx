import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, ExternalLink } from "lucide-react";

import { CONTACT_EMAIL, HELLOASSO_URL } from "@/lib/constants";

const FOOTER_NAV = [
  { href: "/evenements", label: "Evenements" },
  { href: "/recrutement", label: "Recrutement" },
  { href: "/organisateurs", label: "Organisateurs" },
  { href: "/contact", label: "Contact" },
  { href: "/mentions-legales", label: "Mentions legales" },
];

const SOCIALS = [
  {
    href: "https://www.facebook.com/staffezlestous",
    label: "Facebook",
    icon: Facebook,
  },
  {
    href: "https://www.instagram.com/staffezlestous",
    label: "Instagram",
    icon: Instagram,
  },
  {
    href: "https://twitter.com/staffezlestous",
    label: "Twitter / X",
    icon: Twitter,
  },
];

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-black text-gray-400">
      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand column */}
          <div>
            <Link
              href="/"
              className="font-display text-lg font-black uppercase tracking-tight text-white"
            >
              Staffez Les Tous
            </Link>
            <p className="mt-3 text-sm leading-relaxed">
              Association de benevoles specialisee dans le staffing evenementiel
              manga, gaming et pop culture.
            </p>
            <a
              href={HELLOASSO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-red transition-colors hover:text-brand-red-vivid"
            >
              Soutenir sur HelloAsso
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>

          {/* Navigation column */}
          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
              Navigation
            </h3>
            <ul className="mt-3 space-y-2">
              {FOOTER_NAV.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
              Contact
            </h3>
            <div className="mt-3 space-y-3">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="flex items-center gap-2 text-sm transition-colors hover:text-white"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                {CONTACT_EMAIL}
              </a>

              {/* Social links */}
              <div className="flex gap-3 pt-2">
                {SOCIALS.map((social) => (
                  <a
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-brand-red hover:text-white"
                    aria-label={`Suivez-nous sur ${social.label}`}
                  >
                    <social.icon className="h-4 w-4" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs md:flex-row md:px-6 lg:px-8">
          <p>&copy; {currentYear} Staffez Les Tous. Tous droits reserves.</p>
          <Link
            href="/mentions-legales"
            className="transition-colors hover:text-white"
          >
            Mentions legales
          </Link>
        </div>
      </div>
    </footer>
  );
};
