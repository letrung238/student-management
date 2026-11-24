import React, { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, getAllUsers } from "@/lib/auth";
import StudentDirectoryClient from "@/components/StudentDirectoryClient";

export const dynamic = "force-dynamic";

export default async function StudentsPage() {
  const currentUser = await getCurrentUser();
  const allUsers = await getAllUsers();
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
      documents: true,
      _count: {
        select: {
          extracurriculars: true,
          awards: true,
          essays: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <Suspense fallback={<div className="p-6">Đang tải danh sách học sinh...</div>}>
      <StudentDirectoryClient
        students={students}
        allUsers={allUsers}
        currentUser={currentUser}
      />
    </Suspense>
  );
}
