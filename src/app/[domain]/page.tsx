import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CustomerForm } from "./customers/components/CustomerForm";
import LogoutButton from "@/components/LogoutButton"; // Importamos o botão

export default async function CustomersPage(props: {
  params: Promise<{ domain: string }>;
}) {
  const params = await props.params; 
  const session = await auth();
  
  if (!session?.user) redirect("/login");

  const userEmail = session.user.email?.toLowerCase().trim();
  const SUPER_ADMIN_EMAIL = "neto.vellui@gmail.com".toLowerCase().trim();
  const isSuperAdmin = userEmail === SUPER_ADMIN_EMAIL;

  // 1. Buscamos a empresa pelo domínio da URL para pegar o ID correto
  const company = await prisma.company.findUnique({
    where: { slug: params.domain },
  });

  if (!company) return <div className="p-6">Unidade não encontrada.</div>;

  // 2. DEFINIÇÃO DO ID DA EMPRESA PARA A BUSCA
  // Se for você, usamos o ID da empresa da URL. Se não, usamos o ID do usuário logado.
  const targetCompanyId = isSuperAdmin ? company.id : (session.user as any).companyId;

  // 3. SEGURANÇA: Se não for admin e tentar entrar em domínio alheio
  if (!isSuperAdmin && (session.user as any).companyId !== company.id) {
    return (
      <div className="p-20 text-center">
        <h1 className="text-red-500 font-bold">Acesso Negado</h1>
        <LogoutButton />
      </div>
    );
  }

  let customers = [];

  try {
    customers = await (prisma as any).customer.findMany({
      where: { companyId: targetCompanyId }, // Usamos o ID inteligente aqui
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Erro ao carregar lista:", error);
  }

  return (
    <div className="p-6 space-y-6 text-black">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Clientes 
            {isSuperAdmin && <span className="text-[10px] bg-blue-600 px-2 py-1 rounded">MASTER</span>}
          </h1>
          <p className="text-gray-400">Unidade: {company.name}</p>
        </div>
        <div className="flex items-center gap-4">
           <CustomerForm stages={[]} />
           <LogoutButton /> 
        </div>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-4 text-left">Nome</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Telefone</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-10 text-center text-gray-500">Nenhum cliente encontrado.</td>
              </tr>
            ) : (
              customers.map((c: any) => (
                <tr key={c.id} className="border-b hover:bg-gray-50 text-black">
                  <td className="p-4">{c.name}</td>
                  <td className="p-4">{c.email}</td>
                  <td className="p-4">{c.phone}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}