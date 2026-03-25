export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: [
    "/espace-membre/:path*",
    "/admin/:path*",
    "/connexion",
  ],
};
