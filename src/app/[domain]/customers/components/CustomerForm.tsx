"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";

export function CustomerForm({ companyId }: { companyId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      value: formData.get("value"),
      companyId: companyId,
    };

    try {
      const response = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Erro ao salvar");

      (event.target as HTMLFormElement).reset();
      router.refresh();
    } catch (error) {
      alert("Erro ao salvar. O banco pode precisar de uma atualização.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg border grid grid-cols-1 md:grid-cols-5 gap-3">
      <input name="name" placeholder="Nome" required className="p-2 border rounded text-black bg-white" />
      <input name="email" type="email" placeholder="E-mail" required className="p-2 border rounded text-black bg-white" />
      <input name="phone" placeholder="Telefone" className="p-2 border rounded text-black bg-white" />
      <input name="value" type="number" step="0.01" placeholder="Valor (R$)" className="p-2 border rounded text-black bg-white" />
      
      <button 
        type="submit" 
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 font-bold"
      >
        {loading ? "..." : "ADICIONAR"}
      </button>
    </form>
  );
}