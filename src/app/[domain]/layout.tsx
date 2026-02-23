import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;
  const session = await auth();

  // 1. Verificação de sessão (se não houver, manda para o login)
  if (!session?.user) redirect("/login");

  // 2. Identificação do Super Admin via Variável de Ambiente (.env)
  const userEmail = session.user.email?.toLowerCase().trim();
  
  // Aqui ele busca o e-mail que você salvou no .env
  const SUPER_ADMIN_EMAIL = process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL?.toLowerCase().trim();
  
  // Se o e-mail logado for igual ao do .env, isSuperAdmin vira true
  const isSuperAdmin = !!userEmail && userEmail === SUPER_ADMIN_EMAIL;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* MENU LATERAL FIXO */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold tracking-tighter text-blue-400">VELLUI CRM</h2>
          <div className="flex flex-col mt-1">
            <p className="text-[10px] text-slate-400 uppercase font-bold mt-1 tracking-widest">
              {domain}
            </p>
            {/* Tag visual dinâmica baseada no e-mail do .env */}
            {isSuperAdmin && (
              <span className="text-[9px] bg-blue-600 text-white px-2 py-0.5 rounded-full w-fit mt-2 font-black">
                MODO MASTER
              </span>
            )}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link 
            href={`/${domain}/kanban`} 
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors font-medium"
          >
            📊 <span>Funil de Vendas</span>
          </Link>
          <Link 
            href={`/${domain}/customers`} 
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors font-medium"
          >
            👥 <span>Lista de Clientes</span>
          </Link>

          {/* Atalho Master liberado pelo .env */}
          {isSuperAdmin && (
            <Link 
              href="/admin-master" 
              className="flex items-center gap-3 p-3 rounded-lg bg-blue-900/40 hover:bg-blue-800 transition-colors font-medium text-blue-400 mt-6 border border-blue-800/50"
            >
              ⚙️ <span>Painel Master Admin</span>
            </Link>
          )}
        </nav>

        {/* ÁREA DE USUÁRIO E LOGOUT NO RODAPÉ */}
        <div className="p-4 border-t border-slate-800 space-y-4">
          <div className="px-3">
            <p className="text-[10px] text-slate-500 uppercase font-bold truncate">
              Logado como:
            </p>
            <p className="text-[11px] text-slate-300 truncate font-medium">
              {session.user.email}
            </p>
          </div>
          
          <LogoutButton />

          <div className="text-[10px] text-slate-500 text-center pt-2">
            Vellui One © 2026
          </div>
        </div>
      </aside>

      {/* CONTEÚDO DA PÁGINA */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}