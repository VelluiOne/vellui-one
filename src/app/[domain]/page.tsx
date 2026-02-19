import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import { createUser, deleteUser } from "@/actions/user-actions"

// Mudamos a definição do tipo aqui para o TypeScript aceitar 100%
export default async function TenantPage(props: { params: Promise<{ domain: string }> }) {
  const params = await props.params;
  const domain = params.domain;

  const company = await prisma.company.findFirst({
    where: { slug: domain },
    include: { users: true }
  })

  if (!company) return notFound()
  
  const createUserWithId = createUser.bind(null, company.id);

  return (
    <main className="p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 flex justify-between items-end border-l-4 border-blue-600 pl-4">
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-widest font-bold">Unidade Operacional</p>
            <h1 className="text-3xl font-black text-white">{company.name}</h1>
          </div>
          <div className="text-right text-[10px] text-gray-600 uppercase tracking-widest font-mono">
            Auth ID: {company.id}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* COLUNA 1: CADASTRO */}
          <div className="md:col-span-1 bg-gray-800/40 p-6 rounded-3xl border border-gray-700/50 h-fit backdrop-blur-sm">
            <h2 className="text-lg font-bold mb-6 text-white flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
              Novo Usuário
            </h2>
            <form action={createUserWithId} className="space-y-4">
              <input name="name" placeholder="Nome" className="w-full p-4 bg-gray-900/50 rounded-xl border border-gray-700 text-white outline-none focus:border-blue-500 transition-all placeholder:text-gray-600" required />
              <input name="email" type="email" placeholder="E-mail" className="w-full p-4 bg-gray-900/50 rounded-xl border border-gray-700 text-white outline-none focus:border-blue-500 transition-all placeholder:text-gray-600" required />
              <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black shadow-xl shadow-blue-900/20 transition-all uppercase tracking-tighter text-sm">
                Adicionar à Equipe
              </button>
            </form>
          </div>

          {/* COLUNA 2: LISTAGEM */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-lg font-bold text-white px-2 mb-4">Membros Ativos ({company.users.length})</h2>
            <div className="grid gap-3">
              {company.users.map((user) => (
                <div key={user.id} className="p-5 bg-gray-800/30 rounded-2xl border border-gray-800/50 flex justify-between items-center group hover:bg-gray-800/60 hover:border-blue-500/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center text-blue-500 font-bold uppercase border border-blue-500/20">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-white">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  
                  <form action={deleteUser.bind(null, user.id)}>
                    <button type="submit" className="opacity-0 group-hover:opacity-100 bg-red-500/10 text-red-500 px-4 py-2 rounded-lg text-[10px] font-black hover:bg-red-600 hover:text-white transition-all uppercase border border-red-500/20">
                      Remover
                    </button>
                  </form>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}