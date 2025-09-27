import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const productSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  hotmartUrl: z.string().url(),
  imageUrl: z.string().url(),
});

export async function POST(request: Request) {
  const session = await auth();

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