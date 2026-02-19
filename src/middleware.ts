import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from "@/auth" // Importamos o motor de login

export default auth((req) => {
  const url = req.nextUrl
  const hostname = req.headers.get('host')
  const isLoggedIn = !!req.auth // Verifica se o usuário está logado

  const searchPart = process.env.NODE_ENV === 'production' 
    ? '.vellui.com' 
    : '.localhost:3000'

  const subdomain = hostname?.replace(searchPart, '')

  // 1. Se estiver na página de login, deixa passar
  if (url.pathname === '/login') return NextResponse.next()

  // 2. Se não houver subdomínio (página principal do SaaS), deixa passar
  if (!subdomain || subdomain === 'localhost:3000' || subdomain === 'www') {
    return NextResponse.next()
  }

  // 3. BLOQUEIO DE SEGURANÇA: Se tentar acessar subdomínio sem estar logado
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // 4. Se tudo estiver certo, faz o roteamento interno
  return NextResponse.rewrite(new URL(`/${subdomain}${url.pathname}`, req.url))
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}