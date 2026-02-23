import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { KanbanBoard } from "./components/KanbanBoard";

export default async function KanbanPage(props: {
  params: Promise<{ domain: string }>;
}) {
  const params = await props.params;
  const domain = params.domain;

  const session = await auth();
  
  // 1. Verificação de autenticação
  if (!session?.user) redirect("/auth/login");

  // 2. Pegamos o ID da empresa vinculado ao usuário logado
  const userCompanyId = (session.user as any).companyId;

  // 3. BUSCA COMPLETA E SEGURA (Multi-tenant)
  // Filtramos por ID da empresa do usuário E pelo slug da URL (identificador único)
  const company = await (prisma as any).company.findFirst({
    where: { 
      id: userCompanyId,
      slug: domain 
    },
    include: { 
      customers: {
        include: {
          activities: {
            // Ordenamos as atividades para a timeline lateral
            orderBy: { createdAt: "asc" }
          }
        },
        // Ordenamos os leads pelos mais recentes
        orderBy: { createdAt: "desc" }
      } 
    }
  });

  // 4. TRAVA DE SEGURANÇA: Se o domínio na URL não for o dele, bloqueamos.
  if (!company) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 font-sans p-4">
        <div className="text-center p-10 bg-white rounded-[40px] shadow-2xl border border-slate-100 max-w-lg w-full">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl text-red-500 font-bold">!</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter">Acesso Negado</h1>
          <p className="text-slate-500 mt-4 font-medium leading-relaxed">
            Você está tentando acessar o painel de <span className="font-bold text-red-500 underline">"{domain}"</span>. 
            Esta empresa não existe ou você não possui permissão de acesso para este domínio.
          </p>
          <div className="mt-8">
            <a 
              href="/" 
              className="inline-block bg-[#1e293b] text-white px-8 py-4 rounded-2xl font-black uppercase text-[11px] shadow-lg hover:bg-blue-600 transition-all active:scale-95"
            >
              Voltar para o Painel Central
            </a>
          </div>
        </div>
      </div>
    );
  }

  // 5. RENDERIZAÇÃO DO KANBAN
  return (
    <KanbanBoard 
      initialCustomers={company.customers || []} 
      companyName={company.name}
      domain={domain}
    />
  );
}