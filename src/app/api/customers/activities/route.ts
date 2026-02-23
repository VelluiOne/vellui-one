import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const customerId = searchParams.get("customerId");

  if (!customerId) return NextResponse.json({ error: "Missing customerId" }, { status: 400 });

  try {
    const activities = await prisma.activity.findMany({
      where: { customerId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(activities);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching activities" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const activity = await prisma.activity.create({
      data: {
        customerId: body.customerId,
        type: body.type || "NOTE",
        content: body.content,
        meetingLink: body.meetingLink || null,
        scheduledTo: body.scheduledTo ? new Date(body.scheduledTo) : null,
      },
    });

    return NextResponse.json(activity);
  } catch (error: any) {
    console.error("ERRO_AO_SALVAR_ATIVIDADE:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}