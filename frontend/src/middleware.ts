import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Lista de rotas que exigem autenticação
const PROTECTED_ROUTES = ["/dashboard"];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  const { pathname } = req.nextUrl;

  // Se a rota for protegida e não tiver token, redireciona
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route)) && !token) {
    const loginUrl = new URL("/", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Se o usuário tentar acessar "/" mas já estiver logado, manda pro dashboard
  if (pathname === "/" && token) {
    const dashboardUrl = new URL("/dashboard", req.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

// Aplica o middleware apenas para rotas do app (pode ser global)
export const config = {
  matcher: ["/", "/dashboard/:path*"],
};
