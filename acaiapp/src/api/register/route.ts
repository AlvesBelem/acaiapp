import { NextResponse } from "next/server";

import { registerUser } from "@/lib/actions/register";

export async function POST(request: Request) {
  const body = await request.json();

  const result = await registerUser(body);

  if (!result.success) {
    return NextResponse.json(result, { status: 400 });
  }

  return NextResponse.json({ success: true, user: { id: result.user.id } });
}