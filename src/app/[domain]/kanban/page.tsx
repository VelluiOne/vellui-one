import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { KanbanBoard } from "./components/KanbanBoard";

export default async function KanbanPage(props: {
  params: Promise<{ domain: string }>;
}) {
  const params = await props.params;
  const domain = params.domain;

  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const company = await (prisma as any).company.findFirst({
    where: { slug: domain },
    include: { customers: true }
  });

  if (!company) return <div className="p-10 text-center text-black font-bold">Empresa não encontrada</div>;
  
  // Enviamos os dados para o componente que lida com a pesquisa (Client Component)
  return (
    <KanbanBoard 
      initialCustomers={company.customers || []} 
      companyName={company.name}
      domain={domain}
    />
  );
}