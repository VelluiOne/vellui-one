"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";

export function AddCustomerModal({ domain, onClose }: { domain: string, onClose: () => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", value: 0, source: "Instagram" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/customers/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, domain }),
    });
    router.refresh();
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200">
        <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
          <h2 className="text-xl font-black uppercase tracking-tighter">Novo Lead</h2>
          <button onClick={onClose} className="hover:text-blue-200">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Nome do Cliente</label>
            <input required className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 text-black font-medium outline-none focus:border-blue-500" 
              onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Valor (R$)</label>
            <input type="number" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 text-black font-bold outline-none focus:border-blue-500" 
              onChange={e => setFormData({...formData, value: Number(e.target.value)})} />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl transition-all uppercase text-xs tracking-widest shadow-lg shadow-blue-100">
            {loading ? "Salvando..." : "Criar Lead"}
          </button>
        </form>
      </div>
    </div>
  );
}