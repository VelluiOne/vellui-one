import prisma from "@/lib/prisma";
import { auth } from "@/auth"; 
import { redirect } from "next/navigation";
import { createCompanyWithAdmin } from "./actions"; // Verifique se o arquivo chama-se 'actions.ts' ou 'actions.tsx'
import LogoutButton from "@/components/LogoutButton";

export default async function AdminMasterPage() {
  const session = await auth();

  // --- TRAVA DE SEGURANÇA VIA .ENV (DINÂMICA) ---
  const SUPER_ADMIN_EMAIL = process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL?.toLowerCase().trim(); 
  const userEmail = session?.user?.email?.toLowerCase().trim();

  // Se não houver sessão ou o e-mail não for o do .env, redireciona
  if (!userEmail || userEmail !== SUPER_ADMIN_EMAIL) {
    redirect("/login");
  }

  // Busca as empresas com contagem de usuários e clientes (leads)
  const companies = await prisma.company.findMany({
    include: { _count: { select: { users: true, customers: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-black">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">
              Vellui <span className="text-blue-600">Master Admin</span>
            </h1>
            <p className="text-slate-500 font-medium">Painel de Gestão de Unidades SAAS</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">
              Super Admin: {session?.user?.email}
            </div>
            <LogoutButton /> 
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* FORMULÁRIO DE CADASTRO */}
          <div className="md:col-span-1 bg-white p-8 rounded-[40px] shadow-2xl border border-slate-100 h-fit">
            <h2 className="font-black mb-6 uppercase text-[10px] text-slate-400 tracking-[0.2em]">Criar Nova Unidade</h2>
            
            {/* A Action 'createCompanyWithAdmin' deve estar em ./actions.ts */}
            <form action={createCompanyWithAdmin} className="flex flex-col gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold ml-2 uppercase text-slate-400">Dados da Empresa</label>
                <input name="name" placeholder="Nome da Empresa" className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-black" required />
              </div>
              <div className="space-y-1">
                <input name="slug" placeholder="slug-da-url" className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm text-black" required />
              </div>
              
              <div className="h-px bg-slate-100 my-4" />
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold ml-2 uppercase text-slate-400">Usuário Gestor</label>
                <input name="email" type="email" placeholder="E-mail do Administrador" className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-black" required />
              </div>
              <div className="space-y-1">
                <input name="password" type="password" placeholder="Senha de Acesso" className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-black" required />
              </div>

              <button type="submit" className="mt-4 bg-blue-600 text-white font-black p-5 rounded-2xl uppercase text-xs tracking-widest hover:bg-black transition-all shadow-lg shadow-blue-200">
                Ativar Nova Unidade
              </button>
            </form>
          </div>

          {/* LISTA DE UNIDADES */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="font-black mb-6 uppercase text-[10px] text-slate-400 tracking-[0.2em]">Unidades Gerenciadas</h2>
            <div className="grid gap-4">
              {companies.map((c) => (
                <div key={c.id} className="group bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex justify-between items-center hover:shadow-xl transition-all">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      {c.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-800">{c.name}</h3>
                      <p className="text-blue-600 text-[11px] font-black uppercase tracking-tighter">
                        dominio: /{c.slug}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-8">
                    <div className="text-center">
                      <p className="text-[9px] font-black uppercase text-slate-400 mb-1">Usuários</p>
                      <p className="font-bold text-slate-700 bg-slate-50 px-3 py-1 rounded-lg">{c._count.users}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[9px] font-black uppercase text-slate-400 mb-1">Leads</p>
                      <p className="font-bold text-slate-700 bg-slate-50 px-3 py-1 rounded-lg">{c._count.customers}</p>
                    </div>
                  </div>
                </div>
              ))}
              {companies.length === 0 && (
                <div className="text-center p-12 bg-white rounded-[32px] border border-dashed border-slate-300 text-slate-400 font-medium">
                  Nenhuma unidade cadastrada ainda.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}