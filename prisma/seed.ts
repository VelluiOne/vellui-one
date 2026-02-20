import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // 1. Criamos a Empresa B (concorrente) de forma garantida
  const empresaB = await prisma.company.upsert({
    where: { slug: 'empresa-b' },
    update: {},
    create: {
      name: 'Empresa Concorrente B',
      slug: 'empresa-b',
    },
  })

  // 2. Criamos o Cliente Secreto dentro dessa Empresa B
  const cliente = await prisma.customer.create({
    data: {
      name: 'Cliente Secreto da Empresa B',
      email: 'contato@concorrente.com',
      companyId: empresaB.id, // O "muro" de separação
      status: 'ACTIVE'
    }
  })

  console.log(`✅ Sucesso!`)
  console.log(`🏢 Empresa Criada: ${empresaB.name}`)
  console.log(`👤 Cliente Isolado: ${cliente.name}`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })