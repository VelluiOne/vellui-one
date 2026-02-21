import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CustomerForm } from "./components/CustomerForm";

export default async function CustomersPage(props: {
  params: Promise<{ domain: string }>;
}) {
  const params = await props.params; // Essencial para Next.js 15
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const companyId = (session.user as any).companyId;
  let customers = [];

  try {
    customers = await (prisma as any).customer.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Erro ao carregar lista:", error);
  }

  return (
    <div className="p-6 space-y-6 text-black">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Clientes</h1>
          <p className="text-gray-400">Empresa: {params.domain}</p>
        </div>
        <CustomerForm stages={[]} />
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
            {customers.map((c: any) => (
              <tr key={c.id} className="border-b hover:bg-gray-50 text-black">
                <td className="p-4">{c.name}</td>
                <td className="p-4">{c.email}</td>
                <td className="p-4">{c.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}