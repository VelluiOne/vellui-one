import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // 1. Buscamos a Empresa Teste (Slug: empresa-teste)
  const empresaTeste = await prisma.company.findUnique({
    where: { slug: "empresa-teste" }
  })

  if (!empresaTeste) {
    console.log("❌ Erro: Empresa Teste não encontrada. Crie ela no Prisma Studio primeiro!")
    return
  }

  // 2. Criamos o cliente vinculado especificamente a ela
  const customer = await prisma.customer.create({
    data: {
      name: "Cliente Secreto da Empresa B",
      email: "secreto@empresa-b.com",
      companyId: empresaTeste.id, // O segredo da segurança está aqui!
      status: "ACTIVE"
    }
  })

  console.log("✅ Sucesso! Cliente criado e isolado na Empresa Teste:", customer.name)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })