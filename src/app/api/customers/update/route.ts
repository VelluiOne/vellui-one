import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, name, value, email, phone } = body;

    const updated = await (prisma as any).customer.update({
      where: { id },
      data: { 
        name, 
        value: Number(value), 
        email, 
        phone 
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("ERRO_API_UPDATE:", error);
    return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500 });
  }
}