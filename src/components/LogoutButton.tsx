"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-700 transition-all border border-red-200 hover:border-red-500 px-4 py-2 rounded-lg"
    >
      Sair da Conta
    </button>
  );
}