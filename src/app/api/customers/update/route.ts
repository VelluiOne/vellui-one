import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, stage } = body;

    // O (prisma as any) é usado para evitar erros de tipagem caso o schema não esteja sincronizado
    const updatedCustomer = await (prisma as any).customer.update({
      where: { id },
      data: { stage },
    });

    return NextResponse.json(updatedCustomer);
  } catch (error) {
    console.error("Erro na API de Update:", error);
    return NextResponse.json({ error: "Erro ao atualizar o cliente" }, { status: 500 });
  }
}