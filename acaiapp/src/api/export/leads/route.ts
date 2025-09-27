import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "@/lib/prisma";
import { arrayToCsv } from "@/lib/csv";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const leads = await prisma.lead.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  const rows = leads.map((lead) => ({
    id: lead.id,
    name: lead.name,
    email: lead.email,
    userId: lead.userId,
    userName: lead.user.name,
    createdAt: lead.createdAt.toISOString(),
  }));

  const headers = ["id", "name", "email", "userId", "userName", "createdAt"] as const;
  const csv = arrayToCsv(rows, headers);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="leads.csv"',
    },
  });
}