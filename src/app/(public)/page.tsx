import Link from "next/link";

export default function HomePage() {
  return (
    <main id="main-content">
      {/* Hero */}
      <section className="relative flex min-h-[80vh] items-center justify-center bg-brand-black text-white">
        <div className="absolute right-0 top-0 h-64 w-64 bg-gradient-to-bl from-brand-red/30 to-transparent" />
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          {/* Logo placeholder — a remplacer par le vrai logo */}
          <div className="mx-auto mb-8 h-32 w-32 rounded-full bg-brand-red/20" />
          <h1 className="font-display mb-4 text-4xl font-black uppercase tracking-tight md:text-6xl">
            Staffez Les Tous
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-300">
            Association de benevoles passionnes, specialisee dans le staffing evenementiel
            manga, gaming et pop culture.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/recrutement" className="btn-primary px-6 py-3 text-base">
              Rejoindre l&apos;equipe
            </Link>
            <Link href="/evenements" className="btn-secondary px-6 py-3 text-base">
              Nos evenements
            </Link>
          </div>
        </div>
      </section>

      {/* Section Presentation */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 lg:px-8">
        <h2 className="mb-8 text-center text-3xl font-black uppercase text-brand-red-dark">
          Qui sommes-nous ?
        </h2>
        <p className="mx-auto max-w-3xl text-center text-lg text-gray-600">
          Contenu a rediger par le pole communication.
        </p>
      </section>

      {/* Section Evenements preview */}
      <section className="bg-surface-card py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <h2 className="mb-8 text-center text-3xl font-black uppercase text-brand-red-dark">
            Nos evenements
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Placeholder cards — a remplacer par des donnees dynamiques */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="card overflow-hidden">
                <div className="aspect-video bg-gray-200" />
                <div className="p-4">
                  <h3 className="text-xl font-bold">Evenement {i}</h3>
                  <p className="mt-2 text-sm text-gray-500">Description a venir.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA HelloAsso */}
      <section className="section-header text-center">
        <h2>Soutenez-nous</h2>
        <p className="mx-auto mt-4 max-w-2xl text-white/80">
          Chaque don compte pour nous permettre de continuer nos missions.
        </p>
        <a
          href={process.env.NEXT_PUBLIC_HELLOASSO_URL || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-brand-red transition-colors hover:bg-gray-100"
        >
          Faire un don sur HelloAsso
        </a>
      </section>
    </main>
  );
}
