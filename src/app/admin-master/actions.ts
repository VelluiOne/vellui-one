"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { hash } from "bcryptjs"; // Importante: npm install bcryptjs

export async function createCompanyWithAdmin(formData: FormData) {
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Validação básica
  if (!name || !slug || !email || !password) {
    return { error: "Todos os campos são obrigatórios." };
  }

  try {
    // Tratamento rigoroso do slug: minúsculo, sem espaços e sem caracteres especiais
    const cleanSlug = slug
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove acentos
      .replace(/\s+/g, '-')           // Troca espaços por -
      .replace(/[^\w-]+/g, '');       // Remove tudo que não for letra, número ou -

    // Criptografando a senha antes de salvar
    const hashedPassword = await hash(password, 10);

    // Usamos $transaction para garantir que ou cria TUDO ou não cria NADA
    await prisma.$transaction(async (tx) => {
      // 1. Cria a Empresa
      const company = await tx.company.create({
        data: {
          name,
          slug: cleanSlug,
        },
      });

      // 2. Cria o Usuário Administrador vinculado
      await tx.user.create({
        data: {
          name: `Admin ${name}`,
          email: email.toLowerCase().trim(),
          password: hashedPassword, // Agora salva com hash seguro
          companyId: company.id,
        },
      });
    });

    // 3. Atualiza a lista na tela de Admin
    revalidatePath("/admin-master");
    
    return { success: true };
  } catch (error: any) {
    console.error("Erro ao criar empresa:", error);
    
    // Erro P2002 é o código do Prisma para "Unique Constraint" (Duplicidade)
    if (error.code === 'P2002') {
      return { error: "Este slug ou e-mail já está em uso por outra unidade." };
    }
    
    return { error: "Erro interno ao cadastrar unidade no banco de dados." };
  }
}