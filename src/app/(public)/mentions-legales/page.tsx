import type { Metadata } from "next";

import { CONTACT_EMAIL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Mentions legales",
  description: "Mentions legales du site Staffez Les Tous.",
};

export default function MentionsLegalesPage() {
  return (
    <main id="main-content">
      {/* Header bandeau */}
      <section className="section-header text-center">
        <h1 className="text-4xl font-black uppercase md:text-5xl">
          Mentions legales
        </h1>
      </section>

      <div className="section-divider-wide" aria-hidden="true" />

      <article className="mx-auto max-w-3xl px-4 py-16 md:px-6 lg:px-8">
        <section className="mb-10">
          <h2 className="relative mb-4 pl-4 text-2xl font-bold text-brand-red-dark">
            <span
              className="absolute left-0 top-0 h-full w-1 rounded-full bg-brand-red"
              aria-hidden="true"
            />
            Editeur du site
          </h2>
          <p className="text-gray-700">
            <strong>Staffez Les Tous</strong>
            <br />
            Association loi 1901
            <br />
            Siege social : Nantes, France
            <br />
            Email :{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-brand-red hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
        </section>

        <div className="section-divider mb-10" aria-hidden="true" />

        <section className="mb-10">
          <h2 className="relative mb-4 pl-4 text-2xl font-bold text-brand-red-dark">
            <span
              className="absolute left-0 top-0 h-full w-1 rounded-full bg-brand-red"
              aria-hidden="true"
            />
            Hebergement
          </h2>
          <p className="text-gray-700">
            Ce site est heberge par Vercel Inc.
            <br />
            440 N Barranca Ave #4133, Covina, CA 91723, Etats-Unis
            <br />
            Site :{" "}
            <a
              href="https://vercel.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-red hover:underline"
            >
              https://vercel.com
            </a>
          </p>
        </section>

        <div className="section-divider mb-10" aria-hidden="true" />

        <section className="mb-10">
          <h2 className="relative mb-4 pl-4 text-2xl font-bold text-brand-red-dark">
            <span
              className="absolute left-0 top-0 h-full w-1 rounded-full bg-brand-red"
              aria-hidden="true"
            />
            Propriete intellectuelle
          </h2>
          <p className="text-gray-700">
            L&apos;ensemble des contenus presents sur ce site (textes, images,
            logo, graphismes) sont la propriete de l&apos;association Staffez Les
            Tous ou de leurs auteurs respectifs. Toute reproduction, meme
            partielle, est interdite sans autorisation prealable.
          </p>
        </section>

        <div className="section-divider mb-10" aria-hidden="true" />

        <section className="mb-10">
          <h2 className="relative mb-4 pl-4 text-2xl font-bold text-brand-red-dark">
            <span
              className="absolute left-0 top-0 h-full w-1 rounded-full bg-brand-red"
              aria-hidden="true"
            />
            Protection des donnees personnelles
          </h2>
          <p className="text-gray-700">
            Les informations recueillies via les formulaires de contact sont
            destinees uniquement aux membres habilites de l&apos;association
            Staffez Les Tous. Elles sont utilisees pour traiter vos demandes de
            recrutement, de partenariat ou de contact.
          </p>
          <p className="mt-3 text-gray-700">
            Conformement au Reglement General sur la Protection des Donnees
            (RGPD) et a la loi Informatique et Libertes, vous disposez d&apos;un
            droit d&apos;acces, de rectification, de suppression et
            d&apos;opposition sur vos donnees personnelles. Pour exercer ces
            droits, contactez-nous a l&apos;adresse :{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-brand-red hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>

        <div className="section-divider mb-10" aria-hidden="true" />

        <section className="mb-10">
          <h2 className="relative mb-4 pl-4 text-2xl font-bold text-brand-red-dark">
            <span
              className="absolute left-0 top-0 h-full w-1 rounded-full bg-brand-red"
              aria-hidden="true"
            />
            Cookies
          </h2>
          <p className="text-gray-700">
            Ce site utilise uniquement des cookies techniques necessaires a son
            bon fonctionnement. Aucun cookie publicitaire ou de tracking tiers
            n&apos;est utilise.
          </p>
        </section>

        <div className="section-divider mb-10" aria-hidden="true" />

        <section>
          <h2 className="relative mb-4 pl-4 text-2xl font-bold text-brand-red-dark">
            <span
              className="absolute left-0 top-0 h-full w-1 rounded-full bg-brand-red"
              aria-hidden="true"
            />
            Credits
          </h2>
          <p className="text-gray-700">
            Site concu et developpe par les membres de l&apos;association
            Staffez Les Tous.
            <br />
            Icones : Lucide Icons (licence MIT).
            <br />
            Polices : Google Fonts — Montserrat, Inter.
          </p>
        </section>
      </article>
    </main>
  );
}
