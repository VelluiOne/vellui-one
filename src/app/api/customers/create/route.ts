import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Buscamos a empresa pelo slug para vincular o cliente
    const company = await (prisma as any).company.findFirst({
      where: { slug: body.domain }
    });

    const newCustomer = await (prisma as any).customer.create({
      data: {
        name: body.name,
        value: body.value || 0,
        source: body.source,
        stage: "LEAD",
        priority: "MEDIA",
        companyId: company.id
      },
    });

    return NextResponse.json(newCustomer);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao criar" }, { status: 500 });
  }
}