import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { id, action, newDate } = await req.json();

    if (action === "CONCLUIR") {
      await prisma.activity.update({
        where: { id },
        data: { completed: true },
      });
    } else if (action === "ADIAR") {
      await prisma.activity.update({
        where: { id },
        data: { scheduledTo: new Date(newDate), completed: false },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao processar ação" }, { status: 500 });
  }
}