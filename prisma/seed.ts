import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const company = await prisma.company.create({
    data: {
      name: "Vellui Tech",
      slug: "vellui-tech",
      users: {
        create: {
          email: "neto@vellui.com",
          name: "Neto",
        }
      }
    }
  })
  console.log("Banco populado com sucesso!", company)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })