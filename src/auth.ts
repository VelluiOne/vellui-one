import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import prisma from "@/lib/prisma"
import { compare } from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        // Busca o usuário e os dados da empresa vinculada
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: { company: true },
        });

        // Se o usuário não existe ou não tem senha (ex: login social), nega
        if (!user || !user.password) return null;

        // Comparação segura da senha digitada com o Hash do banco
        const isPasswordValid = await compare(
          credentials.password as string,
          user.password
        );

        if (isPasswordValid) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            companyId: user.companyId,
            companySlug: user.company?.slug,
          };
        }
        
        return null;
      },
    }),
  ],
  callbacks: {
    // Adiciona os dados da empresa ao Token JWT
    async jwt({ token, user }) {
      if (user) {
        token.companyId = (user as any).companyId;
        token.companySlug = (user as any).companySlug;
      }
      return token;
    },
    // Transfere os dados do Token para a Sessão (disponível no Front-end)
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).companyId = token.companyId;
        (session.user as any).companySlug = token.companySlug;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // Redireciona para sua página customizada de login
  },
})