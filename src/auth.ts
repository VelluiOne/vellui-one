import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import prisma from "@/lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  // 1. Remova o "adapter: PrismaAdapter(prisma)" temporariamente
  // O SQLite no Edge Runtime tem conflito com o adaptador direto.
  
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        // A busca no banco continua funcionando aqui
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        // Verificação da senha que criamos no Prisma Studio
        if (user && user.password === credentials.password) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            companyId: user.companyId, // Já pegamos o ID da empresa aqui
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    // Injetamos o companyId no Token JWT
    async jwt({ token, user }) {
      if (user) {
        token.companyId = (user as any).companyId;
      }
      return token;
    },
    // E depois passamos do Token para a Sessão
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).companyId = token.companyId;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
})