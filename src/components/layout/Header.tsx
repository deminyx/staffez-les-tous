"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogIn } from "lucide-react";
import { useSession } from "next-auth/react";

import { cn } from "@/lib/utils";

interface NavLink {
  href: string;
  label: string;
}

const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Accueil" },
  { href: "/evenements", label: "Evenements" },
  { href: "/recrutement", label: "Recrutement" },
  { href: "/organisateurs", label: "Organisateurs" },
  { href: "/contact", label: "Contact" },
];

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const toggleMenu = () => setMobileMenuOpen((prev) => !prev);
  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white shadow-sm">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6 lg:px-8"
        aria-label="Navigation principale"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-xl font-black uppercase tracking-tight text-brand-black"
          onClick={closeMenu}
        >
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-red text-sm font-black text-white"
            aria-hidden="true"
          >
            S
          </span>
          <span className="hidden sm:inline">Staffez Les Tous</span>
          <span className="sm:hidden">SLT</span>
        </Link>

        {/* Desktop navigation */}
        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-50 hover:text-brand-red",
                  pathname === link.href ? "text-brand-red" : "text-gray-700",
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTA + Login */}
        <div className="hidden items-center gap-3 md:flex">
          {session?.user ? (
            <Link
              href="/espace-membre"
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-brand-red"
            >
              Mon espace
            </Link>
          ) : (
            <Link
              href="/connexion"
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-brand-red"
              aria-label="Se connecter"
            >
              <LogIn className="h-4 w-4" aria-hidden="true" />
              Connexion
            </Link>
          )}
          <Link href="/recrutement" className="btn-primary text-sm">
            Rejoindre l&apos;equipe
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="rounded-lg p-2 text-gray-700 transition-colors hover:bg-gray-50 md:hidden"
          onClick={toggleMenu}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div id="mobile-menu" className="border-t border-gray-100 bg-white md:hidden">
          <ul className="space-y-1 px-4 py-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "block rounded-lg px-3 py-2 text-base font-medium transition-colors hover:bg-gray-50 hover:text-brand-red",
                    pathname === link.href ? "bg-gray-50 text-brand-red" : "text-gray-700",
                  )}
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="space-y-2 border-t border-gray-100 px-4 py-4">
            {session?.user ? (
              <Link
                href="/espace-membre"
                className="block rounded-lg px-3 py-2 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-brand-red"
                onClick={closeMenu}
              >
                Mon espace
              </Link>
            ) : (
              <Link
                href="/connexion"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-base font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-brand-red"
                onClick={closeMenu}
              >
                <LogIn className="h-4 w-4" aria-hidden="true" />
                Connexion
              </Link>
            )}
            <Link
              href="/recrutement"
              className="btn-primary block w-full text-center"
              onClick={closeMenu}
            >
              Rejoindre l&apos;equipe
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
