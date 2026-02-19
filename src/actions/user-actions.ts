"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createUser(companyId: string, formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string

  await prisma.user.create({
    data: {
      name,
      email,
      companyId,
    }
  })

  revalidatePath("/[domain]", "page")
}

export async function deleteUser(userId: string) {
  await prisma.user.delete({
    where: { id: userId }
  })
  
  revalidatePath("/[domain]", "page")
}