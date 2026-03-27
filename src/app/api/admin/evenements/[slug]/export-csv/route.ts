import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

/**
 * GET /api/admin/evenements/[slug]/export-csv
 *
 * Exporte la liste des benevoles inscrits a un evenement au format CSV.
 * Acces : ADMINISTRATEUR, DEVELOPPEUR, ou COORDINATEUR scope a cet evenement.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifie." }, { status: 401 });
  }

  const { slug } = await params;

  // Charger l'evenement pour obtenir son id
  const event = await prisma.event.findUnique({
    where: { slug },
    select: { id: true, title: true, slug: true },
  });

  if (!event) {
    return NextResponse.json({ error: "Evenement introuvable." }, { status: 404 });
  }

  // Verifier les droits
  const isAdmin = session.user.roles?.some(
    (r) => r.role === "ADMINISTRATEUR" || r.role === "DEVELOPPEUR",
  );
  const isCoordinator = session.user.roles?.some(
    (r) => r.role === "COORDINATEUR" && r.eventId === event.id,
  );

  if (!isAdmin && !isCoordinator) {
    return NextResponse.json({ error: "Acces non autorise." }, { status: 403 });
  }

  // Recuperer les inscriptions
  const inscriptions = await prisma.inscription.findMany({
    where: { eventId: event.id },
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          username: true,
          email: true,
          phone: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  // Construire le CSV
  const headers = [
    "Prenom",
    "Nom",
    "Identifiant",
    "Email",
    "Telephone",
    "Statut",
    "Poste",
    "Horaires",
    "Notes",
    "Date inscription",
  ];

  const STATUS_LABEL: Record<string, string> = {
    EN_ATTENTE: "En attente",
    VALIDEE: "Validee",
    REFUSEE: "Refusee",
  };

  const escape = (value: string | null | undefined): string => {
    const str = value ?? "";
    // Encadrer de guillemets si contient virgule, guillemet ou saut de ligne
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows = inscriptions.map((ins) => [
    escape(ins.user.firstName),
    escape(ins.user.lastName),
    escape(ins.user.username),
    escape(ins.user.email),
    escape(ins.user.phone),
    escape(STATUS_LABEL[ins.status] ?? ins.status),
    escape(ins.position),
    escape(ins.schedule),
    escape(ins.notes),
    escape(ins.createdAt.toISOString().slice(0, 10)),
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  const filename = `benevoles-${event.slug}-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
