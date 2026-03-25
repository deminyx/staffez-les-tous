import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { resetPasswordSchema } from "@/lib/validations";
import { generateSecurePassword } from "@/services/membres";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = resetPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Donnees invalides." },
        { status: 400 },
      );
    }

    const { email } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (user && user.isActive) {
      // Generer un nouveau mot de passe
      const newPassword = generateSecurePassword();
      const passwordHash = await bcrypt.hash(newPassword, 12);

      await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash },
      });

      // TODO: Envoyer le nouveau mot de passe par email (Resend)
      // En attendant, on log en dev
      if (process.env.NODE_ENV === "development") {
        console.log(
          `[DEV] Nouveau mot de passe pour ${user.username}: ${newPassword}`,
        );
      }
    }

    // Toujours retourner succes (securite : ne pas reveler si l'email existe)
    return NextResponse.json({
      message: "Si cette adresse est associee a un compte, un nouveau mot de passe a ete envoye.",
    });
  } catch (error) {
    console.error("Erreur lors de la reinitialisation du mot de passe:", error);
    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 },
    );
  }
}
