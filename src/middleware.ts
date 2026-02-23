import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl
  
  // 1. Busca o e-mail do Super Admin definido no seu arquivo .env
  const SUPER_ADMIN = process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL?.toLowerCase().trim();
  const userEmail = req.auth?.user?.email?.toLowerCase().trim();
  
  const isAuthPage = pathname === "/login"
  const isAdminRoute = pathname.startsWith("/admin-master")
  const isPublicPage = pathname === "/"

  // 2. Se o usuário tentar acessar o login já estando logado
  if (isAuthPage && isLoggedIn) {
    // Se for o admin do .env, manda direto pro Painel Master
    if (userEmail === SUPER_ADMIN) {
      return NextResponse.redirect(new URL("/admin-master", req.nextUrl))
    }
    
    // Se for outro usuário, manda para a home
    return NextResponse.redirect(new URL("/", req.nextUrl))
  }

  // 3. Proteção: Se NÃO estiver logado e NÃO for a página de login ou home, manda logar
  if (!isLoggedIn && !isAuthPage && !isPublicPage) {
    return NextResponse.redirect(new URL("/login", req.nextUrl))
  }

  // 4. Segurança Extra para a rota Admin Master
  if (isAdminRoute && isLoggedIn) {
    // Bloqueia se o e-mail logado NÃO for o que está no .env
    if (userEmail !== SUPER_ADMIN) {
      return NextResponse.redirect(new URL("/", req.nextUrl))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}