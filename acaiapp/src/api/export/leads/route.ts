import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { arrayToCsv } from "@/lib/csv";
import { auth } from "@/lib/auth";

type LeadWithUser = Awaited<ReturnType<typeof prisma.lead.findMany>>[number];

export async function GET() {
  const session = await auth();

  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const leads = await prisma.lead.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  const rows = leads.map((lead: LeadWithUser) => ({
    id: lead.id,
    name: lead.name,
    email: lead.email,
    userId: lead.userId,
    userName: lead.user.name,
    createdAt: lead.createdAt.toISOString(),
  }));

  const headers = ["id", "name", "email", "userId", "userName", "createdAt"];
  const csv = arrayToCsv(rows, headers);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="leads.csv"',
    },
  });
}