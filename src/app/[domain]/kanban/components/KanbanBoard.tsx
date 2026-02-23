"use client"
import { useState } from "react";
import { KanbanCard } from "./KanbanCard";
import { SourceChart } from "./SourceChart";
import { AddCustomerModal } from "./AddCustomerModal";
import { AgendaSidebar } from "./AgendaSidebar";
import { useRouter } from "next/navigation";
import { Calendar } from "lucide-react"; // Adicionei Lucide

export function KanbanBoard({ initialCustomers, companyName, domain }: any) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAgendaOpen, setIsAgendaOpen] = useState(false); // NOVO
  const router = useRouter();

  const filteredCustomers = initialCustomers.filter((c: any) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const closedCustomers = initialCustomers.filter((c: any) => c.stage === 'FECHADO');
  const activeCustomers = initialCustomers.filter((c: any) => c.stage !== 'PERDIDO' && c.stage !== 'FECHADO');
  const totalPipeline = activeCustomers.reduce((acc: number, curr: any) => acc + (curr.value || 0), 0);
  const totalSales = closedCustomers.reduce((acc: number, curr: any) => acc + (curr.value || 0), 0);
  const conversionRate = initialCustomers.length > 0 ? (closedCustomers.length / initialCustomers.length) * 100 : 0;
  const ticketMedio = closedCustomers.length > 0 ? totalSales / closedCustomers.length : 0;

  const sourceDataMap = initialCustomers.reduce((acc: any, curr: any) => {
    const source = curr.source || "Não Informado";
    acc[source] = (acc[source] || 0) + (curr.value || 0);
    return acc;
  }, {});
  const sourceData = Object.keys(sourceDataMap).map(key => ({ name: key, value: sourceDataMap[key] }));

  const columns = [
    { id: "LEAD", title: "LEAD / NOVO", color: "bg-slate-50/50", borderColor: "border-slate-400", letter: "L", btnColor: "bg-slate-400" },
    { id: "NEGOCIACAO", title: "EM NEGOCIAÇÃO", color: "bg-amber-50/50", borderColor: "border-amber-500", letter: "N", btnColor: "bg-amber-500" },
    { id: "FECHADO", title: "FECHADO (VENDA)", color: "bg-green-50/50", borderColor: "border-green-500", letter: "F", btnColor: "bg-green-600" },
    { id: "PERDIDO", title: "PERDIDO", color: "bg-red-50/50", borderColor: "border-red-500", letter: "P", btnColor: "bg-red-600" },
  ];

  const formatMoney = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  async function moveCustomer(id: string, newStage: string) {
    try {
      const res = await fetch("/api/customers/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, stage: newStage }),
      });
      if (res.ok) router.refresh();
    } catch (error) {
      console.error("Erro ao mover card:", error);
    }
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden text-black">
      {/* AREA PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {isAddModalOpen && <AddCustomerModal domain={domain} onClose={() => setIsAddModalOpen(false)} />}
          
          {/* HEADER */}
          <div className="flex flex-col lg:flex-row gap-6 mb-8">
            <div className="flex-1 bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
              <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                  <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">{companyName}</h1>
                  <p className="text-slate-500 font-bold mt-1 text-[10px] uppercase tracking-widest italic">Painel de Vendas</p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  {/* BOTÃO DA AGENDA MOBILE */}
                  <button 
                    onClick={() => setIsAgendaOpen(true)}
                    className="xl:hidden bg-white border-2 border-slate-200 p-2.5 rounded-xl flex items-center gap-2 shadow-sm"
                  >
                    <Calendar size={18} className="text-blue-600" />
                    <span className="text-[10px] font-black uppercase">Agenda</span>
                  </button>

                  <div className="relative flex-1 md:w-64 group">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                    <input type="text" placeholder="Buscar lead..." className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-2.5 pl-10 text-sm outline-none focus:border-blue-500 font-bold" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                  </div>
                  <button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 text-white font-black py-2.5 px-6 rounded-xl text-[11px] uppercase tracking-widest shadow-lg">+ NOVO LEAD</button>
                </div>
              </div>

              {/* DASHBOARD GRID */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[9px] text-slate-400 font-black uppercase mb-1">Aberto</p>
                  <p className="text-lg font-black">{formatMoney(totalPipeline)}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
                  <p className="text-[9px] text-green-600 font-black uppercase mb-1">Ganhos</p>
                  <p className="text-lg font-black text-green-700">{formatMoney(totalSales)}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                  <p className="text-[9px] text-blue-600 font-black uppercase mb-1">Conversão</p>
                  <p className="text-lg font-black text-blue-700">{conversionRate.toFixed(1)}%</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100">
                  <p className="text-[9px] text-purple-600 font-black uppercase mb-1">Ticket Médio</p>
                  <p className="text-lg font-black text-purple-700">{formatMoney(ticketMedio)}</p>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-[350px]"><SourceChart data={sourceData} /></div>
          </div>

          {/* COLUNAS KANBAN */}
          <div className="flex gap-5 min-w-max pb-10">
            {columns.map((col) => {
              const colCustomers = filteredCustomers.filter((c: any) => (c.stage || "LEAD") === col.id);
              return (
                <div key={col.id} className={`w-80 flex flex-col rounded-2xl border-t-[6px] shadow-sm ${col.color} ${col.borderColor}`}>
                  <div className="p-4 bg-white/60 border-b rounded-t-lg">
                    <h2 className="font-black text-slate-800 text-[11px] uppercase">{col.title} ({colCustomers.length})</h2>
                  </div>
                  <div className="p-3 space-y-4">
                    {colCustomers.map((customer: any) => (
                      <div key={customer.id} className="group">
                        <KanbanCard customer={customer} />
                        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all mt-2 h-8 overflow-hidden">
                          {columns.map((btnCol) => btnCol.id !== col.id && (
                            <button key={btnCol.id} onClick={() => moveCustomer(customer.id, btnCol.id)} className={`w-7 h-7 rounded text-[10px] font-black text-white ${btnCol.btnColor}`}>{btnCol.letter}</button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* AGENDA LATERAL (DIREITA) */}
      <AgendaSidebar 
        customers={initialCustomers} 
        isOpen={isAgendaOpen} 
        onClose={() => setIsAgendaOpen(false)} 
      />
    </div>
  );
}