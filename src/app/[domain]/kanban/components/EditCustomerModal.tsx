"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";

export function EditCustomerModal({ customer, onClose }: { customer: any, onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      id: customer.id,
      name: formData.get("name"),
      value: parseFloat(formData.get("value") as string),
      email: formData.get("email"),
      phone: formData.get("phone"),
    };

    try {
      const res = await fetch("/api/customers/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.refresh();
        onClose();
      }
    } catch (error) {
      console.error("Erro ao atualizar:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[999] p-4 text-black">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b bg-gray-50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Editar Cliente</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Nome Completo</label>
            <input name="name" defaultValue={customer.name} className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" required />
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Valor do Negócio (R$)</label>
            <input name="value" type="number" step="0.01" defaultValue={customer.value} className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-green-600" required />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">E-mail de Contato</label>
              <input name="email" type="email" defaultValue={customer.email} className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 p-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-colors text-sm uppercase">Cancelar</button>
            <button type="submit" disabled={loading} className="flex-1 p-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 text-sm uppercase">
              {loading ? "Salvando..." : "Confirmar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}