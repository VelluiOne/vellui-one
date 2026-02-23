"use client";

import { signIn, getSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Adicionei um estado de carregamento
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      alert("Credenciais inválidas!");
      setLoading(false);
    } else {
      const session = await getSession();
      
      // --- LÓGICA DE REDIRECIONAMENTO INTELIGENTE ---
      const SUPER_ADMIN_EMAIL = "neto.vellui@gmail.com";
      const userEmail = session?.user?.email;
      const slug = (session?.user as any)?.companySlug;

      if (userEmail === SUPER_ADMIN_EMAIL) {
        // Se for você, manda direto para o QG
        router.push("/admin-master");
        router.refresh();
      } else if (slug) {
        // Se for usuário de empresa, manda para o Kanban dela
        router.push(`/${slug}/kanban`);
        router.refresh();
      } else {
        // Caso ocorra algum erro e não ache o slug nem seja admin, vai para a home
        router.push("/");
        router.refresh();
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-blue-600">Vellui One</h2>
          <p className="mt-2 text-gray-600">Entre na sua conta para gerenciar sua unidade</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Seu e-mail"
              className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500 text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Sua senha"
              className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500 text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-lg p-3 font-bold text-white transition-colors ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Autenticando..." : "Acessar Sistema"}
          </button>
        </form>
      </div>
    </div>
  );
}