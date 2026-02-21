import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isAuthPage = req.nextUrl.pathname === "/login"

  // 1. Se o usuário tentar acessar o login já estando logado, manda pro início
  if (isAuthPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/", req.nextUrl))
    }
    return NextResponse.next()
  }

  // 2. Se NÃO estiver logado e tentar acessar qualquer outra página, manda pro login
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.nextUrl))
  }

  return NextResponse.next()
})

// Define quais rotas o middleware deve vigiar
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}