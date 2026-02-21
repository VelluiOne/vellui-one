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
      phone: "000000000",
      companyId: companyId, // Envia o ID da empresa da URL
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
      alert("Cliente salvo na empresa correta!");
    } catch (error) {
      alert("Erro ao salvar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg border flex gap-4">
      <input name="name" placeholder="Nome" required className="p-2 border rounded text-black" />
      <input name="email" type="email" placeholder="E-mail" required className="p-2 border rounded text-black" />
      <button 
        type="submit" 
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {loading ? "..." : "Adicionar"}
      </button>
    </form>
  );
}