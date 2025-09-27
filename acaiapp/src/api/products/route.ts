import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

const productSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  hotmartUrl: z.string().url(),
  imageUrl: z.string().url(),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const json = await request.json();
  const parsed = productSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const product = await prisma.product.create({
    data: parsed.data,
  });

  return NextResponse.json({ product });
}