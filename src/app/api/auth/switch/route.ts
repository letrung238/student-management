import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { userId } = await request.json();
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    return NextResponse.json({ error: "Không tìm thấy người dùng" }, { status: 404 });
  }

  const response = NextResponse.json({ ok: true, user });
  response.cookies.set(SESSION_COOKIE_NAME, user.id, {
    path: "/",
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
