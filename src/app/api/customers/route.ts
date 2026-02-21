import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) return new NextResponse("Não autorizado", { status: 401 });

    const body = await req.json();
    const { name, email, phone, companyId } = body;

    // Criamos o cliente usando o companyId que veio do formulário
    const customer = await (prisma as any).customer.create({
      data: {
        name,
        email,
        phone,
        companyId: companyId, 
      },
    });

    return NextResponse.json(customer);
  } catch (error: any) {
    console.error("Erro na API:", error);
    return new NextResponse(`Erro: ${error.message}`, { status: 500 });
  }
}