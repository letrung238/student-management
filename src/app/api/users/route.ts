import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const users = await prisma.user.findMany({
    include: {
      assignments: {
        include: {
          student: {
            select: { id: true, fullName: true, code: true },
          },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json({ users });
}

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Chỉ Admin mới có quyền quản lý nhân sự" },
      { status: 403 }
    );
  }

  const body = await request.json();

  if (body.action === "delete") {
    await prisma.user.delete({ where: { id: body.id } });
    return NextResponse.json({ ok: true });
  }

  const user = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      role: body.role || "COUNSELOR",
      title: body.title || "Chuyên viên Tư vấn Du học",
      phone: body.phone || "",
      avatarColor: body.avatarColor || "#2563eb",
    },
  });

  return NextResponse.json({ user });
}
