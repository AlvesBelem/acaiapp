import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { arrayToCsv } from "@/lib/csv";
import { auth } from "@/lib/auth";

type UserRecord = Awaited<ReturnType<typeof prisma.user.findMany>>[number];

export async function GET() {
  const session = await auth();

  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  const rows = users.map((user: UserRecord) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
  }));

  const headers = ["id", "name", "email", "role", "createdAt"];
  const csv = arrayToCsv(rows, headers);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="usuarios.csv"',
    },
  });
}