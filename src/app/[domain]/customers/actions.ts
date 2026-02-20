"use server"

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCustomerAction(formData: FormData, userEmail: string) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  // 1. Buscamos o ID da empresa do usuário logado para garantir o isolamento
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    select: { companyId: true }
  });

  if (!user?.companyId) throw new Error("Usuário sem empresa vinculada.");

  // 2. Criamos o cliente "amarrado" à empresa do usuário
  await prisma.customer.create({
    data: {
      name,
      email,
      companyId: user.companyId,
      status: "ACTIVE"
    }
  });

  // 3. Atualiza a lista de clientes automaticamente
  revalidatePath("/[domain]/customers", "page");
}