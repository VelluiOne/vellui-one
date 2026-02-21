import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* MENU LATERAL FIXO */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold tracking-tighter text-blue-400">VELLUI CRM</h2>
          <p className="text-[10px] text-slate-400 uppercase font-bold mt-1">{domain}</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link href={`/${domain}/kanban`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors font-medium">
            📊 <span>Funil de Vendas</span>
          </Link>
          <Link href={`/${domain}/customers`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors font-medium">
            👥 <span>Lista de Clientes</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800 text-[10px] text-slate-500 text-center">
          Vellui One © 2026
        </div>
      </aside>

      {/* CONTEÚDO DA PÁGINA */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}