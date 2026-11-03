import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/sign-in(.*)",
    "/sign-up(.*)",
    // Webhooks externos precisam ser publicos (Cakto e Clerk chamam o servidor direto, sem login)
    "/api/webhook/cakto",
    "/api/webhook/clerk",
  ],
  afterAuth(auth, req) {
    // Se o usuário não estiver logado e clicar em qualquer botão que leva ao chat:
    if (!auth.userId && !auth.isPublicRoute) {
      const signInUrl = new URL("/sign-in", req.url);
      // Guarda o link exato que ele clicou (ex: /chat/lilith?action=analise) para abrir direto lá após logar
      signInUrl.searchParams.set("redirect_url", req.url);
      return NextResponse.redirect(signInUrl);
    }
    return NextResponse.next();
  },
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
