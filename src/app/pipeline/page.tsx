import React from "react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import PipelineBoardClient from "@/components/PipelineBoardClient";

export const dynamic = "force-dynamic";

export default async function PipelinePage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) return null;

  const whereClause =
    currentUser.role === "ADMIN"
      ? {}
      : {
          assignments: {
            some: { userId: currentUser.id },
          },
        };

  const students = await prisma.student.findMany({
    where: whereClause,
    include: {
      assignments: { include: { user: true } },
      applications: { include: { school: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return <PipelineBoardClient students={students} />;
}
