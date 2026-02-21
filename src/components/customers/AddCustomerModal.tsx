"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddCustomerModal({ 
  companyId, 
  stages 
}: { 
  companyId: string; 
  stages: { id: string, name: string }[] 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      source: formData.get("source"), // DNA do Lead
      value: parseFloat(formData.get("value") as string) || 0,
      stageId: formData.get("stageId"),
      companyId: companyId,
    };

    // Aqui chamaremos nossa API ou Server Action
    const response = await fetch("/api/customers", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (response.ok) {
      setIsOpen(false);
      router.refresh(); // Atualiza a tabela automaticamente
    }
    setLoading(false);
  }

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        + Novo Cliente
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Cadastrar Novo Lead</h2>
          <p className="text-sm text-gray-500 text-balance">Inicie o rastreio end-to-end deste cliente.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Nome Completo</label>
            <input name="name" required className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: João Silva" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">WhatsApp</label>
              <input name="phone" className="w-full border rounded-lg p-2 text-sm" placeholder="(11) 99999-9999" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Valor Estimado</label>
              <input name="value" type="number" step="0.01" className="w-full border rounded-lg p-2 text-sm" placeholder="R$ 0,00" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Origem (DNA do Lead)</label>
            <select name="source" className="w-full border rounded-lg p-2 text-sm bg-gray-50">
              <option value="Google">Google (Tráfego Pago)</option>
              <option value="Instagram">Instagram</option>
              <option value="WhatsApp">WhatsApp Direto</option>
              <option value="Indicação">Indicação</option>
              <option value="Yeastar">Central Telefônica</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Etapa Inicial</label>
            <select name="stageId" className="w-full border rounded-lg p-2 text-sm bg-gray-50">
              {stages.map(stage => (
                <option key={stage.id} value={stage.id}>{stage.name}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 mt-6">
            <button 
              type="button" 
              onClick={() => setIsOpen(false)}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? "Salvando..." : "Salvar Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}