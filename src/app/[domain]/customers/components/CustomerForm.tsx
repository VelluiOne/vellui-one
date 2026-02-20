"use client" // Essencial para formulários interativos

import { createCustomerAction } from "../actions";

export function CustomerForm({ userEmail }: { userEmail: string }) {
  return (
    <form 
      action={(formData) => createCustomerAction(formData, userEmail)}
      className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8"
    >
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Novo Cliente</h2>
      <div className="flex flex-col gap-4 sm:flex-row">
        <input
          name="name"
          placeholder="Nome do Cliente"
          required
          className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <input
          name="email"
          type="email"
          placeholder="E-mail"
          required
          className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button 
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors font-medium"
        >
          Adicionar
        </button>
      </div>
    </form>
  );
}