import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Nettoyage de la base de donnees...");

  // Supprimer dans l'ordre des dependances
  await prisma.vote.deleteMany();
  await prisma.pollOption.deleteMany();
  await prisma.poll.deleteMany();
  await prisma.ideaLike.deleteMany();
  await prisma.idea.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.inscription.deleteMany();
  await prisma.publication.deleteMany();
  await prisma.userRole.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.event.deleteMany();
  await prisma.contactSubmission.deleteMany();
  await prisma.user.deleteMany();

  console.log("Creation des utilisateurs...");

  const passwordHash = await bcrypt.hash("StaffezTest2024!", 10);

  // Utilisateur admin/dev
  const admin = await prisma.user.create({
    data: {
      username: "admin",
      email: "admin@staffez-les-tous.fr",
      passwordHash,
      firstName: "Admin",
      lastName: "Staff",
      phone: "06 00 00 00 01",
      bio: "Administrateur de la plateforme Staffez Les Tous.",
      isActive: true,
    },
  });

  // Utilisateur membre standard
  const membre = await prisma.user.create({
    data: {
      username: "jdupont",
      email: "jean.dupont@email.fr",
      passwordHash,
      firstName: "Jean",
      lastName: "Dupont",
      phone: "06 12 34 56 78",
      bio: "Passione de manga et de jeux video. Benevole depuis 2023.",
      allergies: "Intolerant au gluten",
      isActive: true,
    },
  });

  // Utilisateur coordinateur
  const coordinateur = await prisma.user.create({
    data: {
      username: "smartin",
      email: "sophie.martin@email.fr",
      passwordHash,
      firstName: "Sophie",
      lastName: "Martin",
      phone: "06 98 76 54 32",
      bio: "Coordinatrice evenements depuis la creation de l'association.",
      isActive: true,
    },
  });

  console.log("Attribution des roles...");

  // Roles globaux
  await prisma.userRole.create({
    data: { userId: admin.id, role: "ADMINISTRATEUR" },
  });

  await prisma.userRole.create({
    data: { userId: admin.id, role: "DEVELOPPEUR" },
  });

  console.log("Creation des evenements...");

  const now = new Date();
  const inTwoWeeks = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
  const inTwoWeeksEnd = new Date(inTwoWeeks.getTime() + 2 * 24 * 60 * 60 * 1000);
  const inOneMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const inOneMonthEnd = new Date(inOneMonth.getTime() + 3 * 24 * 60 * 60 * 1000);
  const inTwoMonths = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
  const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const lastMonthEnd = new Date(lastMonth.getTime() + 2 * 24 * 60 * 60 * 1000);

  const eventMangaFest = await prisma.event.create({
    data: {
      title: "Manga Festival Paris 2025",
      slug: "manga-festival-paris-2025",
      description:
        "Le Manga Festival revient a Paris pour une edition 2025 exceptionnelle ! " +
        "Retrouvez les meilleurs mangakas, des stands de degustation japonaise, " +
        "des projections en avant-premiere et bien plus encore.\n\n" +
        "L'association Staffez Les Tous assure le staffing complet de l'evenement " +
        "avec des postes varies : accueil, securite, logistique, animation.",
      missions:
        "- Accueil et orientation du public\n" +
        "- Gestion des files d'attente aux stands\n" +
        "- Support logistique (montage/demontage)\n" +
        "- Animation d'ateliers manga\n" +
        "- Securite et premiers secours",
      startDate: inTwoWeeks,
      endDate: inTwoWeeksEnd,
      location: "Paris Expo Porte de Versailles",
      type: "PRESTATION",
      status: "PUBLIE",
      inscriptionOpen: true,
      maxVolunteers: 30,
    },
  });

  const eventGameCon = await prisma.event.create({
    data: {
      title: "Game Convention Lyon",
      slug: "game-convention-lyon",
      description:
        "La Game Convention de Lyon est l'evenement incontournable pour les passionnes " +
        "de jeux video et de culture geek. Tournois e-sport, demos exclusives, " +
        "rencontres avec des developpeurs et cosplay parade.\n\n" +
        "Nous recherchons des benevoles motives pour encadrer cet evenement.",
      missions:
        "- Encadrement des tournois e-sport\n" +
        "- Gestion des bornes de demo\n" +
        "- Accueil des visiteurs\n" +
        "- Support technique",
      startDate: inOneMonth,
      endDate: inOneMonthEnd,
      location: "Eurexpo Lyon",
      type: "PRESTATION",
      status: "PUBLIE",
      inscriptionOpen: true,
      maxVolunteers: 20,
    },
  });

  await prisma.event.create({
    data: {
      title: "Soiree Anime Summer",
      slug: "soiree-anime-summer",
      description:
        "Soiree de projection d'animes pour les membres de l'association. " +
        "Au programme : marathon des meilleures sorties de la saison, " +
        "quizz anime et pizza party !",
      startDate: inTwoMonths,
      location: "Local associatif, Nantes",
      type: "VIE_ASSOCIATIVE",
      status: "PUBLIE",
      inscriptionOpen: true,
      maxVolunteers: null,
    },
  });

  // Evenement brouillon (non visible par les membres)
  await prisma.event.create({
    data: {
      title: "Japan Expo 2025 (Brouillon)",
      slug: "japan-expo-2025",
      description: "Details a venir...",
      startDate: new Date(now.getTime() + 120 * 24 * 60 * 60 * 1000),
      location: "Paris Nord Villepinte",
      type: "PRESTATION",
      status: "BROUILLON",
      inscriptionOpen: false,
    },
  });

  // Evenement passe
  const eventPast = await prisma.event.create({
    data: {
      title: "Comic Con Marseille 2024",
      slug: "comic-con-marseille-2024",
      description: "La Comic Con de Marseille, edition 2024.",
      startDate: lastMonth,
      endDate: lastMonthEnd,
      location: "Parc Chanot, Marseille",
      type: "PRESTATION",
      status: "ARCHIVE",
      inscriptionOpen: false,
    },
  });

  // Role coordinateur sur l'event Manga Fest
  await prisma.userRole.create({
    data: {
      userId: coordinateur.id,
      role: "COORDINATEUR",
      eventId: eventMangaFest.id,
    },
  });

  console.log("Creation des inscriptions...");

  // Jean est inscrit au Manga Festival (en attente)
  await prisma.inscription.create({
    data: {
      userId: membre.id,
      eventId: eventMangaFest.id,
      status: "EN_ATTENTE",
      notes: "Disponible samedi et dimanche. Preference pour l'accueil.",
    },
  });

  // Jean etait inscrit au Comic Con (validee — passe)
  await prisma.inscription.create({
    data: {
      userId: membre.id,
      eventId: eventPast.id,
      status: "VALIDEE",
      position: "Accueil stand principal",
      schedule: "Samedi 10h-18h, Dimanche 9h-16h",
    },
  });

  // Sophie est inscrite a la Game Convention (validee)
  await prisma.inscription.create({
    data: {
      userId: coordinateur.id,
      eventId: eventGameCon.id,
      status: "VALIDEE",
      position: "Coordinatrice generale",
      schedule: "Tous les jours, 8h-20h",
    },
  });

  console.log("Seed termine avec succes !");
  console.log("");
  console.log("Comptes de test :");
  console.log("─────────────────────────────────────────────────");
  console.log("  Admin     : admin       / StaffezTest2024!");
  console.log("  Membre    : jdupont     / StaffezTest2024!");
  console.log("  Coordo    : smartin     / StaffezTest2024!");
  console.log("─────────────────────────────────────────────────");
}

main()
  .catch((e) => {
    console.error("Erreur lors du seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
