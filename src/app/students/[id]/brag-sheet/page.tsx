import React from "react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, canUserAccessStudent } from "@/lib/auth";
import BragSheetClient from "@/components/BragSheetClient";

export const dynamic = "force-dynamic";

export default async function BragSheetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const currentUser = await getCurrentUser();
  if (!currentUser) return null;

  const student = await prisma.student.findUnique({
    where: { id },
    include: {
      assignments: { include: { user: true } },
      academics: true,
      extracurriculars: true,
      awards: true,
      applications: { include: { school: true } },
    },
  });

  if (!student || !canUserAccessStudent(currentUser, student.assignments)) {
    return (
      <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center">
        Bạn không có quyền truy cập hồ sơ này.
      </div>
    );
  }

  return <BragSheetClient student={student} />;
}
