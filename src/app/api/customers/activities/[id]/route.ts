import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  req: Request, 
  { params }: { params: { id: string } }
) {
  try {
    // 1. Aguardar os params (necessário em versões novas do Next.js)
    const parameters = await params;
    const id = parameters.id;

    console.log("Tentando excluir a atividade ID:", id);

    if (!id) {
      return NextResponse.json({ error: "ID não identificado na URL" }, { status: 400 });
    }

    // 2. Tentar deletar no banco
    const deleted = await prisma.activity.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: "Atividade excluída!",
      deleted
    });

  } catch (error: any) {
    console.error("ERRO_DETALHADO_PRISMA:", error);
    
    // Se o erro for porque o ID não existe mais no banco
    if (error.code === 'P2025') {
      return NextResponse.json({ error: "Este registro já foi excluído ou não existe." }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Erro no banco: " + error.message }, 
      { status: 500 }
    );
  }
}