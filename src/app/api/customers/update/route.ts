import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;

    // 1. Converte o valor financeiro para número (decimal) se ele existir
    if (data.value) data.value = parseFloat(data.value);

    // 2. Executa a atualização do cliente (Email, Whats, Status, etc)
    const updated = await prisma.customer.update({
      where: { id },
      data: data, // Aqui continua salvando tudo automaticamente
    });

    // 3. SE a nota (notes) veio no envio, vamos criar um registro histórico
    if (data.notes && data.notes.trim() !== "") {
      await prisma.activity.create({
        data: {
          customerId: id,
          type: 'NOTE',
          content: data.notes,
          completed: true // Notas são registros históricos, então já nascem concluídas
        }
      });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("ERRO_UPDATE_CUSTOMER:", error);
    return NextResponse.json({ error: "Erro ao salvar" }, { status: 500 });
  }
}