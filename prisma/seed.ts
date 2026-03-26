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

  // ─── PHASE 4 : BOUTIQUE ─────────────────────────────────

  console.log("Creation des produits boutique...");

  const tshirt = await prisma.product.create({
    data: {
      title: "T-Shirt Staffez Les Tous 2025",
      slug: "tshirt-staffez-2025",
      description:
        "Le t-shirt officiel de l'association Staffez Les Tous, edition 2025. " +
        "Coton bio 180g, serigraphie logo kitsune sur le devant et texte au dos. " +
        "Coupe unisexe, disponible du S au XXL.",
      image: "/images/boutique/tshirt-staffez-2025.jpg",
      priceMember: 1500,
      pricePublic: 2000,
      isAvailable: true,
      variants: {
        create: [
          { label: "S", stock: 10 },
          { label: "M", stock: 15 },
          { label: "L", stock: 20 },
          { label: "XL", stock: 12 },
          { label: "XXL", stock: 5 },
        ],
      },
    },
    include: { variants: true },
  });

  const hoodie = await prisma.product.create({
    data: {
      title: "Hoodie Kitsune Noir",
      slug: "hoodie-kitsune-noir",
      description:
        "Hoodie premium noir avec le logo kitsune brode sur la poitrine. " +
        "Interieur polaire, capuche doublee. Parfait pour les events en exterieur. " +
        "80% coton, 20% polyester.",
      image: "/images/boutique/hoodie-kitsune-noir.jpg",
      priceMember: 3500,
      pricePublic: 4500,
      isAvailable: true,
      variants: {
        create: [
          { label: "S", stock: 5 },
          { label: "M", stock: 8 },
          { label: "L", stock: 10 },
          { label: "XL", stock: 6 },
        ],
      },
    },
    include: { variants: true },
  });

  const stickers = await prisma.product.create({
    data: {
      title: "Pack Stickers Staffez (x5)",
      slug: "pack-stickers-staffez",
      description:
        "Pack de 5 stickers vinyle resistants a l'eau. " +
        'Inclut : logo kitsune, mascotte chibi, texte "Staffez Les Tous", ' +
        "emote manga et badge benevole. Dimensions : 7x7cm chacun.",
      image: "/images/boutique/pack-stickers.jpg",
      priceMember: 500,
      pricePublic: 800,
      isAvailable: true,
      variants: {
        create: [{ label: "Unique", stock: 50 }],
      },
    },
    include: { variants: true },
  });

  await prisma.product.create({
    data: {
      title: "Mug Kitsune Rouge (Rupture)",
      slug: "mug-kitsune-rouge",
      description:
        "Mug en ceramique 350ml avec le kitsune rouge. " +
        "Passe au lave-vaisselle et au micro-ondes.",
      image: "/images/boutique/mug-kitsune.jpg",
      priceMember: 1200,
      pricePublic: 1500,
      isAvailable: false,
      variants: {
        create: [{ label: "Unique", stock: 0 }],
      },
    },
  });

  console.log("Creation des commandes de demo...");

  // Jean a commande un t-shirt M et des stickers
  const variantTshirtM = tshirt.variants.find((v) => v.label === "M")!;
  const variantStickersUnique = stickers.variants.find((v) => v.label === "Unique")!;

  await prisma.order.create({
    data: {
      orderNumber: "CMD-2025-0001",
      userId: membre.id,
      status: "PAYEE",
      totalCents: 1500 + 500,
      items: {
        create: [
          {
            variantId: variantTshirtM.id,
            quantity: 1,
            unitPrice: 1500,
          },
          {
            variantId: variantStickersUnique.id,
            quantity: 1,
            unitPrice: 500,
          },
        ],
      },
    },
  });

  // Sophie a commande un hoodie L
  const variantHoodieL = hoodie.variants.find((v) => v.label === "L")!;

  await prisma.order.create({
    data: {
      orderNumber: "CMD-2025-0002",
      userId: coordinateur.id,
      status: "EN_ATTENTE",
      totalCents: 3500,
      items: {
        create: [
          {
            variantId: variantHoodieL.id,
            quantity: 1,
            unitPrice: 3500,
          },
        ],
      },
    },
  });

  // ─── PHASE 4 : SONDAGES ───────────────────────────────────

  console.log("Creation des sondages...");

  const inOneWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const yesterday = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);

  // Sondage ouvert
  const pollProchainEvent = await prisma.poll.create({
    data: {
      question: "Quel type d'evenement souhaitez-vous pour la prochaine sortie asso ?",
      closesAt: inOneWeek,
      options: {
        create: [
          { label: "Soiree karaoke japonais" },
          { label: "Tournoi Mario Kart" },
          { label: "Atelier cuisine japonaise" },
          { label: "Sortie cinema (anime au grand ecran)" },
        ],
      },
    },
    include: { options: true },
  });

  // Jean vote pour "Tournoi Mario Kart"
  const optionMarioKart = pollProchainEvent.options.find((o) => o.label === "Tournoi Mario Kart")!;
  await prisma.vote.create({
    data: {
      userId: membre.id,
      optionId: optionMarioKart.id,
    },
  });

  // Sondage clos (resultats visibles)
  const pollTshirt = await prisma.poll.create({
    data: {
      question: "Quelle couleur pour le t-shirt 2026 ?",
      closesAt: yesterday,
      options: {
        create: [
          { label: "Rouge classique" },
          { label: "Noir avec logo blanc" },
          { label: "Bleu nuit" },
        ],
      },
    },
    include: { options: true },
  });

  // Votes sur le sondage clos
  const optionNoir = pollTshirt.options.find((o) => o.label === "Noir avec logo blanc")!;
  const optionRouge = pollTshirt.options.find((o) => o.label === "Rouge classique")!;

  await prisma.vote.create({
    data: { userId: membre.id, optionId: optionNoir.id },
  });
  await prisma.vote.create({
    data: { userId: coordinateur.id, optionId: optionNoir.id },
  });
  await prisma.vote.create({
    data: { userId: admin.id, optionId: optionRouge.id },
  });

  // ─── PHASE 4 : BOITE A IDEES ──────────────────────────────

  console.log("Creation des idees...");

  const idea1 = await prisma.idea.create({
    data: {
      title: "Creer un Discord officiel de l'asso",
      description:
        "Ca serait top d'avoir un serveur Discord pour coordonner les events, " +
        "discuter entre benevoles et partager des photos/videos. " +
        "On pourrait avoir des channels par event.",
      authorId: membre.id,
      isApproved: true,
    },
  });

  const idea2 = await prisma.idea.create({
    data: {
      title: "Organiser un week-end team building",
      description:
        "Un week-end entier entre benevoles pour renforcer la cohesion d'equipe. " +
        "Activites type escape game, laser game, barbecue. " +
        "Idealement dans un gite a la campagne.",
      authorId: coordinateur.id,
      isApproved: true,
    },
  });

  await prisma.idea.create({
    data: {
      title: "Vendre des pins kitsune en edition limitee",
      description:
        "Des pins metalliques avec le logo kitsune, en edition limitee. " +
        "Ca pourrait etre un bon goodies a offrir aux benevoles les plus actifs " +
        "ou a vendre sur la boutique.",
      authorId: membre.id,
      isApproved: false,
    },
  });

  // Likes sur les idees approuvees
  await prisma.ideaLike.create({
    data: { userId: admin.id, ideaId: idea1.id },
  });
  await prisma.ideaLike.create({
    data: { userId: coordinateur.id, ideaId: idea1.id },
  });
  await prisma.ideaLike.create({
    data: { userId: membre.id, ideaId: idea2.id },
  });
  await prisma.ideaLike.create({
    data: { userId: admin.id, ideaId: idea2.id },
  });

  // ─── PHASE 4 : SORTIES VIE ASSOCIATIVE ────────────────────

  console.log("Creation de sorties supplementaires...");

  // Sortie proche (dans 10 jours)
  const inTenDays = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000);

  const sortieKaraoke = await prisma.event.create({
    data: {
      title: "Soiree Karaoke Japonais",
      slug: "soiree-karaoke-japonais",
      description:
        "Soiree karaoke entre membres de l'asso ! On chante nos openings " +
        "et endings d'anime preferes. Ambiance garantie, niveau vocal optionnel. " +
        "Boissons et snacks offerts par l'asso.",
      startDate: inTenDays,
      location: "Karaoke Box, Nantes centre",
      type: "VIE_ASSOCIATIVE",
      status: "PUBLIE",
      inscriptionOpen: true,
      maxVolunteers: 15,
    },
  });

  // Sophie est inscrite a la soiree karaoke
  await prisma.inscription.create({
    data: {
      userId: coordinateur.id,
      eventId: sortieKaraoke.id,
      status: "VALIDEE",
    },
  });

  // Sortie passee
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  await prisma.event.create({
    data: {
      title: "Sortie Bowling Benevoles",
      slug: "sortie-bowling-benevoles",
      description:
        "Apres-midi bowling entre benevoles pour decompresser apres le Comic Con. " +
        "2 parties + boissons, ambiance detendue.",
      startDate: twoWeeksAgo,
      location: "Bowling de l'Atlantique, Saint-Herblain",
      type: "VIE_ASSOCIATIVE",
      status: "ARCHIVE",
      inscriptionOpen: false,
    },
  });

  console.log("");
  console.log("Seed termine avec succes !");
  console.log("");
  console.log("Comptes de test :");
  console.log("─────────────────────────────────────────────────");
  console.log("  Admin     : admin       / StaffezTest2024!");
  console.log("  Membre    : jdupont     / StaffezTest2024!");
  console.log("  Coordo    : smartin     / StaffezTest2024!");
  console.log("─────────────────────────────────────────────────");
  console.log("");
  console.log("Donnees de demo Phase 4 :");
  console.log("  Produits  : 4 (dont 1 indisponible)");
  console.log("  Commandes : 2 (1 payee, 1 en attente)");
  console.log("  Sondages  : 2 (1 ouvert, 1 clos)");
  console.log("  Idees     : 3 (2 approuvees, 1 en attente)");
  console.log("  Sorties   : 3 (1 a venir, 1 karaoke, 1 passee)");
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
