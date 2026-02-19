import { auth, signOut } from "@/auth";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-900/80 backdrop-blur-md px-8 py-4 flex justify-between items-center">
      <div className="flex items-center gap-6">
        <span className="text-xl font-black text-blue-500 tracking-tighter italic">VELLUI</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest leading-none">Logado como</p>
          <p className="text-sm font-bold text-white">{session?.user?.name || "Neto"}</p>
        </div>
        
        <form action={async () => { "use server"; await signOut(); }}>
          <button className="bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white px-4 py-2 rounded-lg text-xs font-black border border-red-500/20 transition-all uppercase">
            Sair
          </button>
        </form>
      </div>
    </nav>
  );
}