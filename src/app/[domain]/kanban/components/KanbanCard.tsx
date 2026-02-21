"use client"

import { useState } from "react";
import { EditCustomerModal } from "./EditCustomerModal";

// Note que REMOVI o formatMoney daqui de dentro das chaves
export function KanbanCard({ customer }: { customer: any }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Criamos a função aqui dentro. Agora ela é do "Cliente" e funciona perfeitamente!
  const formatMoney = (val: number) => 
    new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(val);

  return (
    <>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all group relative">
        {/* Botão Editar (Lápis) */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors opacity-0 group-hover:opacity-100 z-10"
          title="Editar Negócio"
        >
          ✏️
        </button>

        <div className="mb-3 pr-6">
          <p className="font-bold text-slate-900 text-sm leading-tight group-hover:text-blue-700">
            {customer.name}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">{customer.email || 'Sem e-mail'}</p>
        </div>
        
        <div className="flex justify-between items-end border-t pt-3">
          <div>
            <p className="text-[8px] font-black text-slate-300 uppercase leading-none mb-1">Valor</p>
            <p className="text-sm font-black text-green-600">
              {formatMoney(customer.value || 0)}
            </p>
          </div>
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