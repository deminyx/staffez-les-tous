import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function HomePage() {
  return (
    <main id="main-content">
      {/* ─── Hero ──────────────────────────────────────────── */}
      <section className="hero-pattern relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-brand-black text-white">
        {/* Diagonal accent top-right */}
        <div className="diagonal-accent-lg opacity-80" aria-hidden="true" />

        {/* Diagonal accent bottom-left */}
        <div className="diagonal-accent-bottom opacity-60" aria-hidden="true" />

        {/* Red glow (atmosphere) */}
        <div
          className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-red/10 blur-3xl"
          aria-hidden="true"
        />

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
          {/* Logo placeholder — a remplacer par le vrai kitsune */}
          <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-2xl border-2 border-brand-red/40 bg-brand-red/10 md:h-36 md:w-36">
            <span className="font-display text-4xl font-black text-brand-red md:text-5xl">
              S
            </span>
          </div>

          <h1 className="font-display mb-6 text-5xl font-black uppercase tracking-tight md:text-7xl lg:text-8xl">
            <span className="text-white">Staffez</span>{" "}
            <span className="text-brand-red">Les Tous</span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gray-300 md:text-xl">
            Association de benevoles passionnes, specialisee dans le staffing
            evenementiel manga, gaming et pop culture.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/recrutement"
              className="btn-primary px-8 py-3.5 text-base shadow-lg shadow-brand-red/25"
            >
              Rejoindre l&apos;equipe
              <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/evenements"
              className="btn-secondary border-white/20 px-8 py-3.5 text-base text-white hover:border-brand-red hover:bg-brand-red"
            >
              Nos evenements
            </Link>
          </div>
        </div>

        {/* Bottom fade to white */}
        <div
          className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-surface-light to-transparent"
          aria-hidden="true"
        />
      </section>

      {/* ─── Section "Qui sommes-nous" ─────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-6 lg:px-8">
        <div className="section-divider mb-10" aria-hidden="true" />
        <h2 className="mb-6 text-center text-3xl font-black uppercase text-brand-red-dark md:text-4xl">
          Qui sommes-nous ?
        </h2>
        <p className="mx-auto max-w-3xl text-center text-lg leading-relaxed text-gray-600">
          Fondee par des passionnes d&apos;evenementiel et de culture geek,
          Staffez Les Tous rassemble des benevoles formes et motives pour
          accompagner les plus grands evenements manga, gaming et pop culture de
          la region.
        </p>

        {/* Chiffres cles */}
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {[
            { value: "40+", label: "Benevoles actifs" },
            { value: "10+", label: "Evenements par an" },
            { value: "2020", label: "Annee de creation" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-gray-100 bg-white p-6 text-center shadow-sm"
            >
              <p className="font-display text-4xl font-black text-brand-red">
                {stat.value}
              </p>
              <p className="mt-1 text-sm font-medium text-gray-500">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Red divider ───────────────────────────────────── */}
      <div className="section-divider-wide" aria-hidden="true" />

      {/* ─── Section Evenements preview (dark) ─────────────── */}
      <section className="section-dark py-20">
        {/* Diagonal decoration */}
        <div className="diagonal-accent opacity-20" aria-hidden="true" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="section-divider mb-10 opacity-60" aria-hidden="true" />
          <h2 className="mb-4 text-center text-3xl font-black uppercase md:text-4xl">
            Nos evenements
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-center text-gray-400">
            Conventions, festivals, tournois... decouvrez ou nos equipes
            interviennent.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Art to Play", type: "Convention manga/gaming", slug: "art-to-play-2024" },
              { name: "Manga City", type: "Convention anime", slug: "manga-city-2024" },
              { name: "Game Arena", type: "Esport & retrogaming", slug: "game-arena-2024" },
            ].map((event) => (
              <Link
                key={event.name}
                href={`/evenements/${event.slug}`}
                className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-brand-red/50 hover:bg-white/10"
              >
                {/* Corner accent */}
                <div
                  className="absolute right-0 top-0 h-16 w-16 bg-gradient-to-bl from-brand-red/20 to-transparent transition-all group-hover:h-20 group-hover:w-20 group-hover:from-brand-red/40"
                  aria-hidden="true"
                />
                <h3 className="font-display text-xl font-bold text-white">
                  {event.name}
                </h3>
                <p className="mt-2 text-sm text-gray-400">{event.type}</p>
                <div className="mt-4">
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-brand-red transition-colors group-hover:text-brand-red-vivid">
                    Voir le detail
                    <ChevronRight className="h-3 w-3" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/evenements"
              className="btn-secondary border-white/20 text-white hover:border-brand-red hover:bg-brand-red"
            >
              Voir tous les evenements
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Red divider ───────────────────────────────────── */}
      <div className="section-divider-wide" aria-hidden="true" />

      {/* ─── CTA HelloAsso ─────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-red px-6 py-16 text-center text-white md:py-20">
        {/* Decorative diagonals */}
        <div
          className="pointer-events-none absolute right-0 top-0 h-48 w-48 md:h-64 md:w-64"
          style={{
            background:
              "linear-gradient(225deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 50%, transparent 50%)",
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 md:h-48 md:w-48"
          style={{
            background:
              "linear-gradient(45deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.06) 50%, transparent 50%)",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10">
          <h2 className="text-3xl font-black uppercase text-white md:text-4xl">
            Soutenez-nous
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/80">
            Chaque don compte pour nous permettre de former nos benevoles,
            financer le materiel et couvrir les frais de deplacement.
          </p>
          <a
            href={process.env.NEXT_PUBLIC_HELLOASSO_URL || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block rounded-lg bg-white px-8 py-3.5 font-semibold text-brand-red shadow-lg transition-all hover:bg-gray-100 hover:shadow-xl"
          >
            Faire un don sur HelloAsso
          </a>
        </div>
      </section>
    </main>
  );
}
