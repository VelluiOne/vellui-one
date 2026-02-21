import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) return new NextResponse("Não autorizado", { status: 401 });

    const body = await req.json();
    const { name, email, phone, value, companyId } = body;

    const customer = await (prisma as any).customer.create({
      data: {
        name,
        email,
        phone: phone || "",
        value: value ? Number(value) : 0, 
        companyId: companyId, 
      },
    });

    return NextResponse.json(customer);
  } catch (error: any) {
    console.error("ERRO NA API:", error);
    return new NextResponse(`Erro: ${error.message}`, { status: 500 });
  }
}