import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const templates = await prisma.countryTemplate.findMany({
    orderBy: [{ country: "asc" }, { category: "asc" }],
  });
  return NextResponse.json({ templates });
}

export async function POST(request: Request) {
  const body = await request.json();

  if (body.action === "delete") {
    await prisma.countryTemplate.delete({ where: { id: body.id } });
    return NextResponse.json({ ok: true });
  }

  const template = await prisma.countryTemplate.create({
    data: {
      country: body.country,
      documentName: body.documentName,
      category: body.category || "Học thuật",
      required: body.required !== false,
      description: body.description || "",
    },
  });

  return NextResponse.json({ template });
}
