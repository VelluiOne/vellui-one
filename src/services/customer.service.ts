import prisma from "@/lib/prisma"; 

/**
 * Busca clientes baseando-se no e-mail do usuário logado (o que vínhamos usando)
 */
export async function getCustomersByCompany(userEmail: string) {
  // 1. Primeiro, descobrimos a qual empresa o usuário pertence
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    select: { companyId: true }
  });

  if (!user?.companyId) return [];

  // 2. Buscamos APENAS os clientes dessa empresa específica
  return await prisma.customer.findMany({
    where: {
      companyId: user.companyId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

/**
 * NOVA FUNÇÃO: Busca clientes baseando-se no domínio (slug) da URL
 * É isso que torna o sistema multi-tenant automático!
 */
export async function getCustomersByDomain(domain: string) {
  // 1. Procuramos a empresa que tem o 'slug' igual ao que está na URL
  const company = await prisma.company.findUnique({
    where: { slug: domain },
    select: { id: true }
  });

  // Se o domínio na URL não existir no banco, não mostramos nada
  if (!company) return [];

  // 2. Buscamos os clientes que pertencem ao ID dessa empresa encontrada
  return await prisma.customer.findMany({
    where: {
      companyId: company.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}