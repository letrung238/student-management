import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const schools = await prisma.school.findMany({
    include: {
      _count: {
        select: { applications: true },
      },
    },
    orderBy: [{ country: "asc" }, { name: "asc" }],
  });
  return NextResponse.json({ schools });
}

export async function POST(request: Request) {
  const body = await request.json();

  if (body.action === "delete") {
    await prisma.school.delete({ where: { id: body.id } });
    return NextResponse.json({ ok: true });
  }

  const school = await prisma.school.create({
    data: {
      name: body.name,
      country: body.country,
      city: body.city || "",
      ranking: body.ranking || "",
      tuitionRange: body.tuitionRange || "",
      defaultRequirements: body.defaultRequirements || "",
      website: body.website || "",
    },
  });

  return NextResponse.json({ school });
}
