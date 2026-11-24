import React, { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, getAllUsers, canUserAccessStudent } from "@/lib/auth";
import StudentDetailClient from "@/components/StudentDetailClient";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const currentUser = await getCurrentUser();
  const allUsers = await getAllUsers();

  if (!currentUser) return null;

  const student = await prisma.student.findUnique({
    where: { id },
    include: {
      assignments: { include: { user: true } },
      academics: true,
      extracurriculars: true,
      awards: true,
      applications: { include: { school: true } },
      essays: true,
      recommendations: true,
      documents: { orderBy: { category: "asc" } },
      roadmapTasks: { orderBy: { dueDate: "asc" } },
      activityNotes: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!student) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-3">
        <h2 className="text-lg font-bold text-slate-900">
          Không tìm thấy hồ sơ học sinh
        </h2>
        <Link
          href="/students"
          className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Danh sách Học sinh</span>
        </Link>
      </div>
    );
  }

  // Kiểm tra quyền truy cập theo nhóm phụ trách
  const hasAccess = canUserAccessStudent(currentUser, student.assignments);

  if (!hasAccess) {
    return (
      <div className="bg-white rounded-2xl p-10 border border-rose-200 max-w-xl mx-auto text-center space-y-4 my-8">
        <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">
          Giới hạn Quyền Truy cập Hồ sơ
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Tài khoản hiện tại của bạn là <strong>{currentUser.name}</strong> (Vai trò:{" "}
          <strong>{currentUser.role}</strong>) chưa nằm trong nhóm nhân viên phụ trách học sinh{" "}
          <strong>{student.fullName}</strong>. Bạn có thể chuyển sang tài khoản{" "}
          <strong>Admin</strong> ở thanh trên cùng để xem toàn bộ hoặc phân công thêm quyền.
        </p>
        <Link
          href="/students"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Danh sách Học sinh của bạn</span>
        </Link>
      </div>
    );
  }

  const allSchools = await prisma.school.findMany({
    orderBy: [{ country: "asc" }, { name: "asc" }],
  });

  return (
    <Suspense fallback={<div className="p-6">Đang tải hồ sơ 360°...</div>}>
      <StudentDetailClient
        student={student}
        allUsers={allUsers}
        allSchools={allSchools}
        currentUser={currentUser}
      />
    </Suspense>
  );
}
