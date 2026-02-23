"use client"
import { useState } from "react";
import { EditCustomerModal } from "./EditCustomerModal";
import { Clock } from "lucide-react"; // Importando o ícone de relógio

export function KanbanCard({ customer }: { customer: any }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatMoney = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  // Mapeamento de cores para a bolinha de prioridade
  const priorityColors: any = {
    ALTA: "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]",
    MEDIA: "bg-yellow-500",
    BAIXA: "bg-blue-500"
  };

  // --- LÓGICA PARA BUSCAR A REUNIÃO DE HOJE ---
  const today = new Date().toLocaleDateString('pt-BR');
  const nextMeeting = customer.activities?.find((a: any) => {
    if (!a.scheduledTo || a.type !== 'MEETING' || a.completed) return false;
    return new Date(a.scheduledTo).toLocaleDateString('pt-BR') === today;
  });

  return (
    <>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all group relative">
        {/* BOTÃO EDITAR */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors opacity-0 group-hover:opacity-100 z-10"
        >
          ✏️
        </button>

        <div className="mb-3 pr-6">
          <div className="flex items-center gap-2 mb-1">
            {/* BOLINHA DE PRIORIDADE */}
            <div 
              title={`Prioridade ${customer.priority}`}
              className={`w-2 h-2 rounded-full ${priorityColors[customer.priority || 'MEDIA']}`} 
            />
            <p className="font-bold text-slate-900 text-sm leading-tight group-hover:text-blue-700">
              {customer.name}
            </p>
          </div>
          <p className="text-[10px] text-slate-400">{customer.email || 'Sem e-mail'}</p>
        </div>

        {/* --- NOVO ALERTA COM HORÁRIO ESPECÍFICO --- */}
        {nextMeeting && (
          <div className="mb-3 py-1.5 px-3 bg-blue-600 text-white text-[9px] font-black rounded-lg flex items-center justify-between animate-pulse shadow-md">
            <div className="flex items-center gap-2">
              <Clock size={12} />
              <span className="uppercase tracking-wider italic">Reunião Hoje</span>
            </div>
            <span className="bg-white text-blue-600 px-1.5 py-0.5 rounded shadow-sm">
              {new Date(nextMeeting.scheduledTo).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        )}
        
        <div className="flex justify-between items-end border-t pt-3">
          <div>
            <p className="text-[8px] font-black text-slate-300 uppercase mb-1">Valor</p>
            <p className="text-sm font-black text-green-600">{formatMoney(customer.value || 0)}</p>
          </div>
          
          {/* BADGE DE ORIGEM (SOURCE) */}
          {customer.source && (
            <div className="flex flex-col items-end gap-1">
               {customer.activities?.length > 0 && (
                 <span className="text-[7px] font-bold text-blue-500 uppercase">
                   {customer.activities.length} Atividades
                 </span>
               )}
               <span className="text-[9px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase tracking-wider">
                {customer.source}
              </span>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <EditCustomerModal 
          customer={customer} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </>
  );
}