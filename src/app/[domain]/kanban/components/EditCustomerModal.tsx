"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CustomerTimeline } from "./CustomerTimeline";

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

  async function handleDelete() {
    if (!confirm("⚠️ ATENÇÃO: Deseja excluir este lead permanentemente?")) return;
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
      alert("Erro ao excluir cliente.");
    } finally {
      setLoading(false);
    }
  }

  // AQUI ESTÁ A ÚNICA PARTE ALTERADA PARA FUNCIONAR O HISTÓRICO
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
        // 1. Atualiza os dados do servidor
        router.refresh(); 
        
        // 2. Pequeno delay seguido de reload para a Timeline carregar a nova nota
        setTimeout(() => {
          window.location.reload();
        }, 500);

        onClose();
      }
    } catch (error) {
      alert("Erro ao atualizar cadastro.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-4 text-black font-sans">
      <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-6xl overflow-hidden max-h-[95vh] border border-slate-200 flex flex-col">
        
        {/* HEADER */}
        <div className="bg-[#1e293b] p-6 text-white flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tighter italic">Detalhes do Lead</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Painel de Edição</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-800 transition-all text-slate-400 hover:text-white font-bold"
          >
            ✕
          </button>
        </div>

        {/* CONTEÚDO EM DUAS COLUNAS */}
        <div className="overflow-y-auto p-8 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* COLUNA ESQUERDA: FORMULÁRIO (5 de 12) */}
            <form onSubmit={handleSubmit} className="lg:col-span-5 space-y-6">
              
              {/* NOME */}
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-1.5 block tracking-widest italic">Nome do Cliente</label>
                <input 
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3.5 text-sm focus:border-blue-500 outline-none transition-all text-black font-bold shadow-sm"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              {/* VALOR E PRIORIDADE */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 mb-1.5 block tracking-widest italic">Valor (R$)</label>
                  <input 
                    type="number"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3.5 text-sm font-black text-green-600 outline-none shadow-sm"
                    value={formData.value}
                    onChange={(e) => setFormData({...formData, value: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 mb-1.5 block tracking-widest italic">Prioridade</label>
                  <select 
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3.5 text-sm font-black outline-none shadow-sm"
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  >
                    <option value="BAIXA">🔵 BAIXA</option>
                    <option value="MEDIA">🟡 MÉDIA</option>
                    <option value="ALTA">🔴 ALTA</option>
                  </select>
                </div>
              </div>

              {/* ORIGEM */}
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-1.5 block tracking-widest italic">Origem</label>
                {!isCustomSource ? (
                  <select 
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3.5 text-sm text-black font-bold outline-none focus:border-blue-500 shadow-sm"
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
                    <option value="Google Ads">Google Ads</option>
                    <option value="Indicação">Indicação</option>
                    <option value="OUTRO">+ OUTRA ORIGEM</option>
                  </select>
                ) : (
                  <input 
                    className="w-full border-2 border-blue-200 rounded-xl p-3.5 text-sm text-black bg-blue-50/30 outline-none font-bold shadow-sm"
                    placeholder="Digite a origem..."
                    value={formData.source}
                    onChange={(e) => setFormData({...formData, source: e.target.value})}
                    autoFocus
                  />
                )}
              </div>

              {/* E-MAIL E WHATSAPP */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 mb-1.5 block tracking-widest italic">E-mail</label>
                  <input 
                    type="email"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3.5 text-sm text-black font-bold outline-none shadow-sm"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 mb-1.5 block tracking-widest italic">WhatsApp</label>
                  <input 
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3.5 text-sm text-black font-bold outline-none shadow-sm"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              {/* DESCRIÇÃO */}
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-1.5 block tracking-widest italic">Notas Internas</label>
                <textarea 
                  rows={3}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm outline-none resize-none font-medium text-slate-600 shadow-sm"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />
              </div>

              {/* BOTÕES */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={handleDelete}
                  className="text-red-400 hover:text-red-600 font-black uppercase text-[10px] tracking-widest transition-colors"
                >
                  🗑️ Excluir Lead
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-[#1e293b] text-white font-black py-4 px-10 rounded-2xl shadow-xl hover:bg-blue-600 transition-all uppercase text-[11px] active:scale-95"
                >
                  {loading ? "Processando..." : "Atualizar Cadastro"}
                </button>
              </div>
            </form>

            {/* COLUNA DIREITA: TIMELINE (7 de 12) */}
            <div className="lg:col-span-7 border-l border-slate-100 lg:pl-10">
              <CustomerTimeline customerId={customer.id} />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}