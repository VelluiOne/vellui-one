import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CustomerForm } from "./components/CustomerForm";

export default async function CustomersPage(props: {
  params: Promise<{ domain: string }>;
}) {
  const params = await props.params;
  const domain = params.domain;

  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  let customers = [];
  let companyId = "";

  try {
    // Busca a empresa pelo domínio da URL
    const company = await (prisma as any).company.findFirst({
      where: { slug: domain },
    });

    if (company) {
      companyId = company.id;
      // Busca clientes APENAS desta empresa
      customers = await (prisma as any).customer.findMany({
        where: { companyId: company.id },
        orderBy: { createdAt: "desc" },
      });
    }
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
  }

  return (
    <div className="p-6 space-y-6 text-black bg-white min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Clientes</h1>
          <p className="text-gray-500">
            Empresa: <span className="font-bold text-blue-600 uppercase">{domain}</span>
          </p>
        </div>
        {/* Passamos o ID da empresa para o formulário saber onde salvar */}
        <CustomerForm companyId={companyId} />
      </div>

      <div className="rounded-md border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-left">Nome</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Telefone</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr><td colSpan={3} className="p-8 text-center">Nenhum cliente nesta empresa.</td></tr>
            ) : (
              customers.map((c: any) => (
                <tr key={c.id} className="border-b">
                  <td className="p-4 font-medium">{c.name}</td>
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