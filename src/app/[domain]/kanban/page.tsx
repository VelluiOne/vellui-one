import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default async function KanbanPage(props: {
  params: Promise<{ domain: string }>;
}) {
  const params = await props.params;
  const domain = params.domain;

  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  // Busca a empresa e os clientes
  const company = await (prisma as any).company.findFirst({
    where: { slug: domain },
    include: { customers: true }
  });

  if (!company) return <div className="p-10 text-center">Empresa não encontrada</div>;
  const customers = company.customers || [];

  // Configuração das Colunas
  const columns = [
    { id: "LEAD", title: "Lead / Novo", color: "border-blue-500 bg-blue-50", letter: "L" },
    { id: "NEGOCIACAO", title: "Em Negociação", color: "border-yellow-500 bg-yellow-50", letter: "N" },
    { id: "FECHADO", title: "Fechado (Venda)", color: "border-green-500 bg-green-50", letter: "F" },
    { id: "PERDIDO", title: "Perdido", color: "border-red-500 bg-red-50", letter: "P" },
  ];

  // AÇÃO PARA MOVER O CLIENTE
  async function moveCustomer(formData: FormData) {
    "use server"
    const id = formData.get("id") as string;
    const newStage = formData.get("newStage") as string;
    
    await (prisma as any).customer.update({
      where: { id },
      data: { stage: newStage }
    });

    revalidatePath(`/${domain}/kanban`);
  }

  const formatMoney = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="p-6 bg-gray-100 min-h-screen text-black">
      {/* CABEÇALHO E RESUMO FINANCEIRO */}
      <div className="mb-8 flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Funil de Vendas</h1>
          <p className="text-slate-500 font-medium mt-1">
            Gestão comercial da unidade: <span className="text-blue-600 font-bold uppercase">{domain}</span>
          </p>
        </div>
        <div className="text-right bg-green-50 p-4 rounded-lg border border-green-100">
          <p className="text-[10px] text-green-700 uppercase font-black mb-1 leading-none">Pipeline Ativo</p>
          <p className="text-2xl font-black text-green-600">
            {formatMoney(customers.filter((c:any) => c.stage !== 'PERDIDO').reduce((acc:any, curr:any) => acc + (curr.value || 0), 0))}
          </p>
        </div>
      </div>

      {/* ÁREA DO KANBAN */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {columns.map((col) => {
          const colCustomers = customers.filter((c: any) => (c.stage || "LEAD") === col.id);
          const totalValue = colCustomers.reduce((acc: number, curr: any) => acc + (curr.value || 0), 0);

          return (
            <div key={col.id} className={`flex flex-col rounded-xl border-t-8 shadow-sm bg-slate-50 min-h-[650px] ${col.color}`}>
              {/* Título da Coluna */}
              <div className="p-4 bg-white/80 backdrop-blur-sm flex justify-between items-start border-b mb-2">
                <div>
                  <h2 className="font-black text-slate-800 text-xs uppercase tracking-wider">{col.title}</h2>
                  <p className="text-xs font-bold text-slate-500 mt-0.5">{formatMoney(totalValue)}</p>
                </div>
                <span className="bg-slate-800 text-white px-2.5 py-1 rounded-md text-[10px] font-black">
                  {colCustomers.length}
                </span>
              </div>

              {/* Espaço dos Cards */}
              <div className="p-3 space-y-4">
                {colCustomers.length === 0 ? (
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center mt-4">
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest italic">Sem Leads</p>
                  </div>
                ) : (
                  colCustomers.map((customer: any) => (
                    <div key={customer.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all group relative">
                      <div className="mb-3">
                        <p className="font-bold text-slate-900 text-sm leading-tight group-hover:text-blue-700">{customer.name}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{customer.email || 'Sem e-mail'}</p>
                      </div>
                      
                      <div className="flex justify-between items-end border-t pt-3">
                        <div>
                          <p className="text-[8px] font-black text-slate-300 uppercase leading-none mb-1">Valor</p>
                          <p className="text-sm font-black text-green-600">{formatMoney(customer.value || 0)}</p>
                        </div>

                        {/* Botões de Ação com as Iniciais L, N, F, P */}
                        <div className="flex gap-1.5">
                          {columns.map((btnCol) => (
                            btnCol.id !== col.id && (
                              <form key={btnCol.id} action={moveCustomer}>
                                <input type="hidden" name="id" value={customer.id} />
                                <input type="hidden" name="newStage" value={btnCol.id} />
                                <button 
                                  title={`Mover para ${btnCol.title}`}
                                  className={`w-7 h-7 rounded-lg text-[10px] font-black text-white flex items-center justify-center shadow-sm transition-all active:scale-95 hover:brightness-110
                                    ${btnCol.id === 'LEAD' ? 'bg-blue-500' : ''}
                                    ${btnCol.id === 'NEGOCIACAO' ? 'bg-yellow-500' : ''}
                                    ${btnCol.id === 'FECHADO' ? 'bg-green-600' : ''}
                                    ${btnCol.id === 'PERDIDO' ? 'bg-red-600' : ''}
                                  `}
                                >
                                  {btnCol.letter}
                                </button>
                              </form>
                            )
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}