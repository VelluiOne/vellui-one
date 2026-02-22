"use client"
import { useState } from "react";
import { KanbanCard } from "./KanbanCard";
import { SourceChart } from "./SourceChart";
import { AddCustomerModal } from "./AddCustomerModal";
import { useRouter } from "next/navigation";

export function KanbanBoard({ initialCustomers, companyName, domain }: any) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const router = useRouter();

  // 1. FILTRO DE BUSCA
  const filteredCustomers = initialCustomers.filter((c: any) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 2. LÓGICA DE MÉTRICAS (KPIs)
  const closedCustomers = initialCustomers.filter((c: any) => c.stage === 'FECHADO');
  const activeCustomers = initialCustomers.filter((c: any) => c.stage !== 'PERDIDO' && c.stage !== 'FECHADO');
  const totalPipeline = activeCustomers.reduce((acc: number, curr: any) => acc + (curr.value || 0), 0);
  const totalSales = closedCustomers.reduce((acc: number, curr: any) => acc + (curr.value || 0), 0);
  
  const conversionRate = initialCustomers.length > 0 
    ? (closedCustomers.length / initialCustomers.length) * 100 
    : 0;

  const ticketMedio = closedCustomers.length > 0 ? totalSales / closedCustomers.length : 0;

  // 3. LÓGICA DO GRÁFICO (O QUE ESTAVA FALTANDO!)
  const sourceDataMap = initialCustomers.reduce((acc: any, curr: any) => {
    const source = curr.source || "Não Informado";
    acc[source] = (acc[source] || 0) + (curr.value || 0);
    return acc;
  }, {});
  
  const sourceData = Object.keys(sourceDataMap).map(key => ({ 
    name: key, 
    value: sourceDataMap[key] 
  }));

  // CONFIGURAÇÃO DAS COLUNAS
  const columns = [
    { id: "LEAD", title: "LEAD / NOVO", color: "border-blue-500 bg-blue-50/50", letter: "L", btnColor: "bg-blue-500" },
    { id: "NEGOCIACAO", title: "EM NEGOCIAÇÃO", color: "border-yellow-500 bg-yellow-50/50", letter: "N", btnColor: "bg-yellow-500" },
    { id: "FECHADO", title: "FECHADO (VENDA)", color: "border-green-500 bg-green-50/50", letter: "F", btnColor: "bg-green-600" },
    { id: "PERDIDO", title: "PERDIDO", color: "border-red-500 bg-red-50/50", letter: "P", btnColor: "bg-red-600" },
  ];

  const formatMoney = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  async function moveCustomer(id: string, newStage: string) {
    await fetch("/api/customers/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, stage: newStage }),
    });
    router.refresh();
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen text-black font-sans">
      {isAddModalOpen && <AddCustomerModal domain={domain} onClose={() => setIsAddModalOpen(false)} />}
      
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        <div className="flex-1 bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                {companyName}
              </h1>
              <p className="text-slate-500 font-bold mt-1 text-[10px] uppercase tracking-widest italic">Painel de Vendas</p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64 group">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                <input 
                  type="text" 
                  placeholder="Buscar..." 
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 transition-all text-black"
                  value={searchTerm} 
                  onChange={e => setSearchTerm(e.target.value)} 
                />
              </div>
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-black py-2.5 px-6 rounded-xl text-[11px] uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-blue-100"
              >
                + NOVO LEAD
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-[10px] text-slate-400 font-black uppercase mb-1">Aberto</p>
              <p className="text-xl font-black text-slate-800">{formatMoney(totalPipeline)}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
              <p className="text-[10px] text-green-600 font-black uppercase mb-1">Total Ganho</p>
              <p className="text-xl font-black text-green-700">{formatMoney(totalSales)}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
              <p className="text-[10px] text-blue-600 font-black uppercase mb-1">Conversão</p>
              <p className="text-xl font-black text-blue-700">{conversionRate.toFixed(1)}%</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100">
              <p className="text-[10px] text-purple-600 font-black uppercase mb-1">Ticket Médio</p>
              <p className="text-xl font-black text-purple-700">{formatMoney(ticketMedio)}</p>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[350px]">
          <SourceChart data={sourceData} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {columns.map((col) => {
          const colCustomers = filteredCustomers.filter((c: any) => (c.stage || "LEAD") === col.id);
          const colValue = colCustomers.reduce((acc: number, curr: any) => acc + (curr.value || 0), 0);

          return (
            <div key={col.id} className={`flex flex-col rounded-2xl border-t-[6px] shadow-sm min-h-[600px] ${col.color} border-slate-200`}>
              <div className="p-4 bg-white/60 backdrop-blur-sm flex justify-between items-start border-b mb-3 rounded-t-lg">
                <div>
                  <h2 className="font-black text-slate-800 text-[11px] uppercase tracking-widest">{col.title} ({colCustomers.length})</h2>
                  <p className="text-xs font-bold text-slate-500 mt-0.5">{formatMoney(colValue)}</p>
                </div>
              </div>

              <div className="p-3 space-y-4">
                {colCustomers.map((customer: any) => (
                  <div key={customer.id} className="group flex flex-col">
                    <KanbanCard customer={customer} />
                    
                    {/* BOTÕES LNFP COM ANIMAÇÃO NO HOVER */}
                    <div className="flex gap-1.5 px-1 opacity-0 -translate-y-2 h-0 group-hover:opacity-100 group-hover:translate-y-0 group-hover:h-9 group-hover:mt-2 transition-all duration-300 ease-out overflow-hidden">
                      {columns.map((btnCol) => btnCol.id !== col.id && (
                        <button 
                          key={btnCol.id}
                          onClick={() => moveCustomer(customer.id, btnCol.id)}
                          className={`w-7 h-7 rounded-lg text-[10px] font-black text-white flex items-center justify-center transition-all hover:scale-115 active:scale-90 shadow-sm ${btnCol.btnColor}`}
                        >
                          {btnCol.letter}
                        </button>
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
  );
}