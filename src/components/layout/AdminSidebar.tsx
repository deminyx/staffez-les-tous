"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  ArrowLeft,
  Menu,
  X,
  ChevronRight,
  Shield,
  ShoppingBag,
  Heart,
} from "lucide-react";

import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    label: "Tableau de bord",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Utilisateurs",
    href: "/admin/utilisateurs",
    icon: Users,
  },
  {
    label: "Evenements",
    href: "/admin/evenements",
    icon: Calendar,
  },
  {
    label: "Publications",
    href: "/admin/publications",
    icon: FileText,
  },
  {
    label: "Boutique",
    href: "/admin/boutique",
    icon: ShoppingBag,
  },
  {
    label: "Vie associative",
    href: "/admin/vie-associative",
    icon: Heart,
  },
];

export const AdminSidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-surface-dark text-white shadow-lg lg:hidden"
        aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-full w-64 flex-col bg-surface-dark transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-brand-red/40 bg-brand-red/10">
            <Shield className="h-5 w-5 text-brand-red" aria-hidden="true" />
          </div>
          <span className="font-display text-sm font-bold uppercase tracking-wider text-white">
            Administration
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Navigation administration">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                    isActive(item.href)
                      ? "bg-brand-red/20 text-brand-red-vivid"
                      : "text-gray-400 hover:bg-white/5 hover:text-white",
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 shrink-0",
                      isActive(item.href)
                        ? "text-brand-red"
                        : "text-gray-500 group-hover:text-gray-300",
                    )}
                    aria-hidden="true"
                  />
                  {item.label}
                  {isActive(item.href) && (
                    <ChevronRight
                      className="ml-auto h-4 w-4 text-brand-red/60"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer — Back to member area */}
        <div className="border-t border-white/10 p-3">
          <Link
            href="/espace-membre"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 transition-all hover:bg-white/5 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" aria-hidden="true" />
            Espace membre
          </Link>
        </div>
      </aside>
    </>
  );
};
