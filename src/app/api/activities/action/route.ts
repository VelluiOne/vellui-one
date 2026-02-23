import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, action, newDate } = body;

    console.log("Recebendo ação:", action, "para ID:", id); // Log para debug

    if (action === "CONCLUIR") {
      await prisma.activity.update({
        where: { id: id },
        data: { completed: true },
      });
    } else if (action === "ADIAR" && newDate) {
      await prisma.activity.update({
        where: { id: id },
        data: { 
          scheduledTo: new Date(newDate),
          completed: false 
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("ERRO NA API DE ATIVIDADE:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}