"use client"
import { useState, useEffect, useCallback } from "react";

export function CustomerTimeline({ customerId }: { customerId: string }) {
  const [note, setNote] = useState("");
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  
  // Estados para o Agendamento
  const [scheduledDate, setScheduledDate] = useState("");
  const [meetingLink, setMeetingLink] = useState("");

  const loadActivities = useCallback(async () => {
    try {
      const res = await fetch(`/api/customers/activities?customerId=${customerId}`);
      if (res.ok) {
        const data = await res.json();
        setActivities(data);
      }
    } catch (e) { console.error("Erro ao carregar"); }
  }, [customerId]);

  useEffect(() => { loadActivities(); }, [loadActivities]);

  const save = async (type = "NOTE") => {
    // Validação simples
    if (!isScheduling && !note.trim()) return;
    if (isScheduling && !scheduledDate) {
        alert("Por favor, selecione uma data para o agendamento.");
        return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/customers/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId,
          type: isScheduling ? "MEETING" : type,
          content: isScheduling ? `📅 Reunião Agendada` : note,
          meetingLink: meetingLink || null,
          scheduledTo: scheduledDate ? new Date(scheduledDate).toISOString() : null,
        }),
      });

      if (res.ok) {
        setNote(""); 
        setMeetingLink(""); 
        setScheduledDate(""); 
        setIsScheduling(false);
        loadActivities();
      }
    } catch (e) { 
      alert("Erro ao salvar no banco."); 
    } finally { 
      setLoading(false); 
    }
  };

  const deleteActivity = async (id: string) => {
    if(!confirm("⚠️ Deseja excluir permanentemente este registro?")) return;
    try {
      const res = await fetch(`/api/customers/activities/${id}`, { 
        method: 'DELETE' 
      });
      if(res.ok) {
        loadActivities();
      } else {
        alert("Erro ao excluir do banco.");
      }
    } catch (e) {
      alert("Falha na conexão.");
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50 p-6 rounded-[32px] border-2 border-slate-200">
      <h3 className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest italic">
        Linha do Tempo & Agenda
      </h3>
      
      {/* ÁREA DE INPUT */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm mb-6 transition-all">
        {!isScheduling ? (
          <>
            <textarea 
              className="w-full text-sm outline-none resize-none text-slate-700 min-h-[60px] font-bold placeholder:text-slate-300"
              placeholder="Digite uma anotação sobre o atendimento..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
              <button 
                onClick={() => setIsScheduling(true)} 
                className="text-[10px] font-black text-blue-600 hover:text-blue-800 uppercase italic transition-colors"
              >
                📅 Agendar Compromisso
              </button>
              <button 
                onClick={() => save()} 
                disabled={loading || !note.trim()} 
                className="bg-slate-800 hover:bg-black text-white text-[10px] font-black px-6 py-2 rounded-xl shadow-md transition-all disabled:opacity-50"
              >
                {loading ? "GRAVANDO..." : "SALVAR NOTA"}
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block">Data e Hora</label>
                <input 
                  type="datetime-local" 
                  className="w-full p-2.5 bg-slate-50 border-2 border-slate-100 rounded-lg text-xs font-bold focus:border-blue-500 outline-none transition-all text-black" 
                  value={scheduledDate} 
                  onChange={(e) => setScheduledDate(e.target.value)} 
                />
              </div>
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block">Link do Meet (Opcional)</label>
                <input 
                  type="text" 
                  placeholder="https://meet.google.com/..." 
                  className="w-full p-2.5 bg-slate-50 border-2 border-slate-100 rounded-lg text-xs font-bold focus:border-blue-500 outline-none transition-all text-black" 
                  value={meetingLink} 
                  onChange={(e) => setMeetingLink(e.target.value)} 
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button 
                onClick={() => save()} 
                disabled={loading || !scheduledDate}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black p-3 rounded-xl uppercase shadow-lg transition-all disabled:bg-slate-200"
              >
                {loading ? "AGENDANDO..." : "Confirmar Agendamento"}
              </button>
              <button 
                onClick={() => setIsScheduling(false)} 
                className="px-4 text-[10px] font-black text-slate-400 hover:text-slate-600 uppercase transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* LISTAGEM DAS ATIVIDADES */}
      <div className="space-y-3 overflow-y-auto max-h-[450px] pr-2 custom-scrollbar">
        {activities.length === 0 && (
            <p className="text-center text-slate-300 text-[10px] font-bold py-10 uppercase tracking-widest">Nenhuma atividade registrada</p>
        )}
        
        {activities.map((act: any) => (
          <div 
            key={act.id} 
            className={`p-4 rounded-2xl border transition-all ${
                act.type === 'MEETING' 
                ? 'border-blue-200 bg-blue-50/40 shadow-sm' 
                : 'border-slate-100 bg-white hover:border-slate-300'
            } relative group`}
          >
            <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase mb-1">
              <span className={act.type === 'MEETING' ? 'text-blue-600' : ''}>
                {act.type === 'MEETING' ? '🚀 Agendamento de Reunião' : '📝 Nota Interna'}
              </span>
              <button 
                onClick={() => deleteActivity(act.id)} 
                className="text-red-300 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all font-black"
              >
                Excluir
              </button>
            </div>
            
            {act.type === 'MEETING' && act.scheduledTo && (
              <div className="mb-2 p-2 bg-white rounded-lg border border-blue-100 inline-flex items-center gap-2 shadow-sm">
                <span className="text-[10px]">📅</span>
                <p className="text-[10px] font-black text-blue-600">
                    {new Date(act.scheduledTo).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </p>
              </div>
            )}
            
            <p className="text-sm text-slate-700 font-bold leading-relaxed">{act.content}</p>
            
            {act.meetingLink && (
              <a 
                href={act.meetingLink.startsWith('http') ? act.meetingLink : `https://${act.meetingLink}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[10px] text-blue-500 hover:text-blue-700 underline font-black mt-3 transition-colors"
              >
                <span>🔗</span> ACESSAR LINK DA REUNIÃO
              </a>
            )}
            
            <div className="mt-2 text-[8px] text-slate-300 font-bold text-right italic">
                Criado em: {new Date(act.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}