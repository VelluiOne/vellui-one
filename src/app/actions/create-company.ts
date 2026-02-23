"use server";

import prisma from "@/lib/prisma";
import { hash } from "bcryptjs"; // Certifique-se de ter o bcryptjs instalado
import { revalidatePath } from "next/cache";

export async function createCompany(formData: FormData) {
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string; // O domínio (ex: larvilas)
  const ownerEmail = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    // 1. Criar a empresa
    const company = await prisma.company.create({
      data: {
        name,
        slug: slug.toLowerCase().trim(),
      },
    });

    // 2. Criar o usuário dono da unidade vinculado a essa empresa
    // A senha é criptografada para segurança
    const hashedPassword = await hash(password, 10);

    await prisma.user.create({
      data: {
        email: ownerEmail.toLowerCase().trim(),
        password: hashedPassword,
        name: `Admin ${name}`,
        companyId: company.id, // O elo de ligação entre usuário e empresa
      },
    });

    // 3. Atualiza a lista na tela de Admin Master
    revalidatePath("/admin-master");

    return { success: true };
  } catch (error: any) {
    console.error("Erro ao criar unidade:", error);
    return { success: false, error: "Erro ao criar empresa ou e-mail já existe." };
  }
}