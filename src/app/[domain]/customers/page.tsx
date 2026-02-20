import { getCustomersByDomain } from "@/services/customer.service";
import { CustomerForm } from "./components/CustomerForm";

export default async function CustomersPage({ 
  params 
}: { 
  params: Promise<{ domain: string }> 
}) {
  const { domain } = await params;

  // BUSCA AUTOMÁTICA: Agora o sistema usa o domínio da URL para filtrar
  const customers = await getCustomersByDomain(domain);

  // Mantemos seu e-mail apenas para o formulário saber quem está logado
  const userEmail = "neto.vellui@gmail.com"; 

  return (
    <div className="max-w-5xl mx-auto p-8">
      <header className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900">
          Gestão de Clientes
        </h1>
        <p className="text-blue-600 font-medium">
          Unidade atual: <span className="underline">{domain}</span>
        </p>
      </header>
      
      <CustomerForm userEmail={userEmail} />

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-700">Lista de Clientes</h2>
        {customers.length === 0 ? (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <p className="text-yellow-700">Nenhum cliente encontrado para "{domain}".</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {customers.map((c) => (
              <div key={c.id} className="p-4 bg-white border rounded-lg shadow-sm flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-800">{c.name}</p>
                  <p className="text-sm text-gray-500">{c.email}</p>
                </div>
                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full uppercase">Ativo</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}