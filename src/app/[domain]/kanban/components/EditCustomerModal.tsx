"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";

export function EditCustomerModal({ customer, onClose }: { customer: any, onClose: () => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isCustomSource, setIsCustomSource] = useState(false);
  
  const [formData, setFormData] = useState({
    name: customer.name || "",
    email: customer.email || "",
    phone: customer.phone || "",
    value: customer.value || 0,
    source: customer.source || "",
    priority: customer.priority || "MEDIA",
    notes: customer.notes || "",
  });

  // --- NOVA FUNÇÃO: EXCLUIR ---
  async function handleDelete() {
    if (!confirm("⚠️ ATENÇÃO: Tem certeza que deseja excluir este lead permanentemente? Esta ação não pode ser desfeita.")) return;
    
    setLoading(true);
    try {
      const res = await fetch("/api/customers/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: customer.id }),
      });

      if (res.ok) {
        router.refresh();
        onClose();
      }
    } catch (error) {
      console.error("Erro ao deletar:", error);
      alert("Erro ao excluir cliente.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/customers/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: customer.id, ...formData }),
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
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 text-black">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-y-auto max-h-[90vh] border border-slate-200 relative">
        
        {/* HEADER FIXO */}
        <div className="bg-slate-900 p-6 text-white flex justify-between items-center sticky top-0 z-50 shadow-md">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tighter">Ficha do Negócio</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Editando Lead</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* COLUNA 1 */}
            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-1.5 block tracking-widest">Nome do Cliente</label>
                <input 
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 text-sm focus:border-blue-500 focus:bg-white outline-none transition-all text-black font-medium"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-1.5 block tracking-widest">Valor Estimado (R$)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">R$</span>
                  <input 
                    type="number"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 pl-10 text-sm font-black text-green-600 focus:border-green-500 focus:bg-white outline-none transition-all"
                    value={formData.value}
                    onChange={(e) => setFormData({...formData, value: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-1.5 block tracking-widest">Prioridade</label>
                <select 
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 text-sm font-black outline-none"
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                >
                  <option value="BAIXA">🔵 BAIXA</option>
                  <option value="MEDIA">🟡 MÉDIA</option>
                  <option value="ALTA">🔴 ALTA</option>
                </select>
              </div>
            </div>

            {/* COLUNA 2 */}
            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-1.5 block tracking-widest">Origem</label>
                {!isCustomSource ? (
                  <select 
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 text-sm text-black font-medium outline-none focus:border-blue-500"
                    value={formData.source}
                    onChange={(e) => {
                      if (e.target.value === "OUTRO") {
                        setIsCustomSource(true);
                        setFormData({...formData, source: ""});
                      } else {
                        setFormData({...formData, source: e.target.value});
                      }
                    }}
                  >
                    <option value="">Selecione...</option>
                    <option value="Instagram">Instagram</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Google">Google Ads</option>
                    <option value="Indicação">Indicação</option>
                    <option value="OUTRO">+ OUTRA ORIGEM</option>
                  </select>
                ) : (
                  <input 
                    className="w-full border-2 border-blue-200 rounded-xl p-3 text-sm text-black bg-blue-50/30 outline-none"
                    value={formData.source}
                    onChange={(e) => setFormData({...formData, source: e.target.value})}
                  />
                )}
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-1.5 block tracking-widest">E-mail</label>
                <input 
                  type="email"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 text-sm text-black outline-none focus:border-blue-500"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-1.5 block tracking-widest">Telefone</label>
                <input 
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 text-sm text-black outline-none focus:border-blue-500"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="mt-8">
            <label className="text-[10px] font-black uppercase text-slate-400 mb-1.5 block tracking-widest">Notas / Observações</label>
            <textarea 
              rows={4}
              className="w-full border-2 border-slate-100 rounded-2xl p-4 text-sm outline-none text-black bg-slate-50/50 resize-none italic"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
          </div>

          {/* RODAPÉ COM BOTÃO DE EXCLUIR E SALVAR */}
          <div className="mt-8 flex items-center justify-between border-t pt-6 gap-4">
            <button 
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="flex items-center gap-2 text-red-400 hover:text-red-600 transition-all font-black uppercase text-[10px] tracking-widest px-4 py-2 rounded-lg hover:bg-red-50 disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Excluir Lead
            </button>

            <div className="flex gap-3 flex-1 justify-end">
              <button 
                type="button" 
                onClick={onClose} 
                className="px-6 py-4 rounded-2xl font-black text-slate-400 hover:text-slate-600 uppercase text-xs tracking-widest"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="bg-slate-900 hover:bg-blue-600 text-white font-black py-4 px-8 rounded-2xl shadow-xl transition-all disabled:opacity-50 active:scale-95 uppercase text-xs tracking-widest"
              >
                {loading ? "Salvando..." : "Salvar Alterações"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}