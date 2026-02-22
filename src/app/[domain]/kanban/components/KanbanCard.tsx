"use client"
import { useState } from "react";
import { EditCustomerModal } from "./EditCustomerModal";

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
        
        <div className="flex justify-between items-end border-t pt-3">
          <div>
            <p className="text-[8px] font-black text-slate-300 uppercase mb-1">Valor</p>
            <p className="text-sm font-black text-green-600">{formatMoney(customer.value || 0)}</p>
          </div>
          
          {/* BADGE DE ORIGEM (SOURCE) */}
          {customer.source && (
            <span className="text-[9px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase tracking-wider">
              {customer.source}
            </span>
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