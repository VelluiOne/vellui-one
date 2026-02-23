import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans text-black p-6">
      {/* Background Decorativo Sutil */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]"></div>
      </div>

      <main className="text-center max-w-3xl">
        <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter mb-4">
          Vellui <span className="text-blue-600">One</span>
        </h1>
        <p className="text-slate-600 text-lg md:text-xl font-medium mb-12 max-w-xl mx-auto">
          A plataforma inteligente para gestão de leads e unidades SAAS de alta performance.
        </p>

        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          {/* Botão para Clientes / Usuários Comuns */}
          <Link 
            href="/login" 
            className="w-full md:w-auto bg-black text-white px-10 py-5 rounded-2xl font-black uppercase text-sm tracking-widest hover:scale-105 transition-all shadow-xl shadow-slate-200"
          >
            Acessar Minha Unidade
          </Link>

          {/* Botão de Atalho para Você (Master Admin) */}
          <Link 
            href="/admin-master" 
            className="w-full md:w-auto bg-blue-600 text-white px-10 py-5 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-blue-700 hover:scale-105 transition-all shadow-xl shadow-blue-200"
          >
            Painel Master
          </Link>
        </div>

        <div className="mt-20 pt-10 border-t border-slate-100">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
            © 2026 Vellui Tech • Software as a Service
          </p>
        </div>
      </main>
    </div>
  );
}