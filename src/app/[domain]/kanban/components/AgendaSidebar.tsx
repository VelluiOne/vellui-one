"use client"
import { Calendar, Clock, Video, User, ChevronRight, X, Check, Timer } from "lucide-react";
import { useRouter } from "next/navigation";

export function AgendaSidebar({ customers, isOpen, onClose }: { customers: any[], isOpen?: boolean, onClose?: () => void }) {
  const router = useRouter();

  // Filtramos apenas reuniões que NÃO estão concluídas
  const meetings = customers.flatMap(customer => 
    (customer.activities || [])
      .filter((a: any) => a.type === 'MEETING' && a.scheduledTo && !a.completed)
      .map((a: any) => ({ ...a, customerName: customer.name }))
  ).sort((a, b) => new Date(a.scheduledTo).getTime() - new Date(b.scheduledTo).getTime());

  const todayStr = new Date().toLocaleDateString('pt-BR');
  const meetingsToday = meetings.filter(m => new Date(m.scheduledTo).toLocaleDateString('pt-BR') === todayStr);

  // Função para Concluir ou Adiar
  async function handleAction(id: string, action: "CONCLUIR" | "ADIAR") {
    let body: any = { id, action };
    
    if (action === "ADIAR") {
      const newTime = prompt("Para que horas deseja adiar hoje? (Ex: 17:00)");
      if (!newTime) return;
      
      const [hours, minutes] = newTime.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes), 0);
      body.newDate = date.toISOString();
    }

    const res = await fetch("/api/activities/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) router.refresh();
  }

  const Content = () => (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-200">
            <Calendar size={20} />
          </div>
          <div>
            <h2 className="font-black text-slate-800 uppercase tracking-tighter text-lg leading-none">Agenda</h2>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Compromissos</p>
          </div>
        </div>
        <button onClick={onClose} className="xl:hidden p-2 text-slate-400 hover:text-red-500 transition-colors">
          <X size={24} />
        </button>
      </div>

      <section className="mb-8">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-4">Hoje</h3>
        <div className="space-y-4">
          {meetingsToday.length === 0 ? (
            <div className="p-4 border-2 border-dashed border-slate-100 rounded-2xl text-center">
              <p className="text-[11px] text-slate-300 font-bold italic">Nenhum compromisso hoje.</p>
            </div>
          ) : (
            meetingsToday.map((meeting) => {
              const mDate = new Date(meeting.scheduledTo);
              const now = new Date();
              const isPast = mDate < now; // Passou do horário
              const isNow = Math.abs(mDate.getTime() - now.getTime()) < 20 * 60000; // Janela de 20min

              return (
                <div key={meeting.id} className={`p-4 rounded-2xl border transition-all shadow-sm ${
                  isNow ? 'bg-green-50 border-green-200 ring-2 ring-green-100' : 
                  isPast ? 'bg-red-50 border-red-200 shadow-md shadow-red-50' : 'bg-slate-50 border-slate-100'
                }`}>
                  <div className={`flex items-center gap-2 mb-3 font-black italic text-[10px] ${
                    isPast ? 'text-red-600' : isNow ? 'text-green-600' : 'text-blue-600'
                  }`}>
                    <Clock size={14} />
                    {mDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    {isPast ? " • ATRASADO" : isNow ? " • AGORA" : ""}
                  </div>
                  
                  <div className="flex items-start gap-2 mb-4">
                    <User size={14} className="text-slate-400 mt-0.5" />
                    <p className="text-sm font-black text-slate-800 uppercase leading-tight tracking-tighter">
                      {meeting.customerName}
                    </p>
                  </div>

                  {/* BOTÕES DE AÇÃO */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <button 
                      onClick={() => handleAction(meeting.id, "CONCLUIR")}
                      className="bg-white border border-slate-200 text-[9px] font-black py-2 rounded-xl hover:bg-green-600 hover:text-white hover:border-green-600 transition-all flex items-center justify-center gap-1 shadow-sm"
                    >
                      <Check size={12} /> FEITO
                    </button>
                    <button 
                      onClick={() => handleAction(meeting.id, "ADIAR")}
                      className="bg-white border border-slate-200 text-[9px] font-black py-2 rounded-xl hover:bg-slate-800 hover:text-white transition-all flex items-center justify-center gap-1 shadow-sm"
                    >
                      <Timer size={12} /> ADIAR
                    </button>
                  </div>

                  {meeting.meetingLink && (
                    <a 
                      href={meeting.meetingLink.startsWith('http') ? meeting.meetingLink : `https://${meeting.meetingLink}`}
                      target="_blank" 
                      className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-[10px] font-black text-white transition-all shadow-md ${isNow ? 'bg-green-600 hover:bg-black' : 'bg-blue-600 hover:bg-black'}`}
                    >
                      <Video size={14} /> ENTRAR NA REUNIÃO
                    </a>
                  )}
                </div>
              )
            })
          )}
        </div>
      </section>

      <section>
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-4">Próximos dias</h3>
        <div className="space-y-2">
          {meetings.filter(m => new Date(m.scheduledTo).toLocaleDateString('pt-BR') !== todayStr).slice(0, 5).map(meeting => (
            <div key={meeting.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border-b border-slate-50 group transition-colors">
              <div>
                <p className="text-[9px] font-black text-blue-500 uppercase">
                  {new Date(meeting.scheduledTo).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                </p>
                <p className="text-xs font-bold text-slate-700 truncate w-32 tracking-tighter">{meeting.customerName}</p>
              </div>
              <ChevronRight size={14} className="text-slate-200 group-hover:text-blue-500" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  return (
    <>
      <div className="w-80 border-l border-slate-200 bg-white h-screen overflow-y-auto p-6 hidden xl:block shadow-[-10px_0_15_rgba(0,0,0,0.02)]">
        <Content />
      </div>
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-white p-6 overflow-y-auto xl:hidden">
          <Content />
        </div>
      )}
    </>
  );
}