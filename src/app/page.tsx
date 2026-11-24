import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { PIPELINE_STAGES, DOC_STATUS_LABELS } from "@/lib/constants";
import {
  ArrowRight,
  CalendarClock,
  FileWarning,
  CheckCircle2,
  Plus,
  Globe2,
  MessageSquare,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
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
      documents: true,
      roadmapTasks: {
        where: { completed: false },
        orderBy: { dueDate: "asc" },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  const recentNotes = await prisma.activityNote.findMany({
    where:
      currentUser.role === "ADMIN"
        ? {}
        : {
            student: {
              assignments: {
                some: { userId: currentUser.id },
              },
            },
          },
    include: {
      student: {
        select: { id: true, fullName: true, code: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const stageCounts = PIPELINE_STAGES.map((stage) => ({
    ...stage,
    count: students.filter((s) => s.pipelineStage === stage.id).length,
  }));

  const countryMap: Record<string, number> = {};
  students.forEach((s) => {
    s.targetCountries
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean)
      .forEach((c) => {
        countryMap[c] = (countryMap[c] || 0) + 1;
      });
  });

  const upcomingTasks = students
    .flatMap((s) =>
      s.roadmapTasks.map((t) => ({
        ...t,
        studentId: s.id,
        studentName: s.fullName,
      }))
    )
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 6);

  const pendingDocs = students.flatMap((s) =>
    s.documents
      .filter(
        (d) => d.status === "PENDING_REVIEW" || d.status === "NEEDS_REVISION"
      )
      .map((d) => ({
        ...d,
        studentId: s.id,
        studentName: s.fullName,
      }))
  );

  return (
    <div className="space-y-6">
      {/* Minimal Clean Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200/80">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
            Trang chủ
          </h1>
          <p className="text-[13px] text-gray-500 mt-0.5">
            {currentUser.role === "ADMIN"
              ? `Tổng quan toàn bộ ${students.length} hồ sơ học sinh du học trong hệ thống.`
              : `Bạn đang phụ trách ${students.length} hồ sơ học sinh du học.`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/pipeline"
            className="px-3.5 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 text-[13px] font-medium transition"
          >
            Bảng 4 bước
          </Link>
          <Link
            href="/students"
            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-medium transition inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Quản lý Học sinh</span>
          </Link>
        </div>
      </div>

      {/* 4-Step Pipeline Stat Strip — Flat & Crisp */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {stageCounts.map((stage) => (
          <Link
            key={stage.id}
            href={`/students?stage=${stage.id}`}
            className="p-4 rounded-xl border border-gray-200/90 bg-white hover:border-indigo-300 transition group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${stage.dotClass}`} />
                <span className="text-[13px] font-medium text-gray-700 group-hover:text-indigo-700 transition">
                  {stage.shortLabel}
                </span>
              </div>
              <span className="text-xl font-semibold text-gray-900">
                {stage.count}
              </span>
            </div>
            <p className="text-[12px] text-gray-400 mt-2 line-clamp-1">
              {stage.description}
            </p>
          </Link>
        ))}
      </div>

      {/* Main Split Content: Left Student List + Right Tasks/Docs/Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Clean Student List */}
        <div className="lg:col-span-2 space-y-5">
          <div className="rounded-xl border border-gray-200/90 bg-white overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-[14px] font-semibold text-gray-900">
                Hồ sơ học sinh đang xử lý
              </h2>
              <Link
                href="/students"
                className="text-[12px] font-medium text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
              >
                <span>Xem tất cả</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-gray-100">
              {students.map((stu) => {
                const stageMeta =
                  PIPELINE_STAGES.find((s) => s.id === stu.pipelineStage) ||
                  PIPELINE_STAGES[0];
                return (
                  <div
                    key={stu.id}
                    className="px-4 py-3.5 hover:bg-gray-50/70 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link
                          href={`/students/${stu.id}`}
                          className="text-[14px] font-medium text-gray-900 hover:text-indigo-600 transition"
                        >
                          {stu.fullName}
                        </Link>
                        <span className="text-[11px] font-mono text-gray-400">
                          {stu.code}
                        </span>
                        <span
                          className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${stageMeta.badgeClass}`}
                        >
                          {stageMeta.shortLabel}
                        </span>
                      </div>
                      <div className="text-[12px] text-gray-500 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        <span>{stu.currentSchool}</span>
                        <span className="text-gray-300">•</span>
                        <span>GPA {stu.gpa}</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-gray-700 font-medium">
                          {stu.englishTestType} {stu.englishScore}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span>
                          {stu.targetCountries} ({stu.targetIntake})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        href={`/students/${stu.id}/brag-sheet`}
                        className="px-2.5 py-1 rounded-lg border border-gray-200 hover:bg-gray-100 text-[12px] text-gray-600 font-medium transition"
                      >
                        Xuất PDF
                      </Link>
                      <Link
                        href={`/students/${stu.id}`}
                        className="px-3 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[12px] font-medium transition"
                      >
                        Chi tiết
                      </Link>
                    </div>
                  </div>
                );
              })}

              {students.length === 0 && (
                <div className="p-8 text-center text-[13px] text-gray-400">
                  Chưa có hồ sơ học sinh nào được phân công cho bạn.
                </div>
              )}
            </div>
          </div>

          {/* Country Breakdown Clean Strip */}
          <div className="rounded-xl border border-gray-200/90 bg-white p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-[13px] font-semibold text-gray-900">
                <Globe2 className="w-4 h-4 text-gray-400" />
                <span>Thị trường Du học & Phân bổ Trường mục tiêu</span>
              </div>
              <div className="flex items-center gap-3 text-[12px] text-gray-500">
                <span>
                  Reach:{" "}
                  <strong className="text-gray-900">
                    {students.reduce(
                      (acc, s) =>
                        acc +
                        s.applications.filter((a) => a.category === "REACH")
                          .length,
                      0
                    )}
                  </strong>
                </span>
                <span>
                  Match:{" "}
                  <strong className="text-gray-900">
                    {students.reduce(
                      (acc, s) =>
                        acc +
                        s.applications.filter((a) => a.category === "MATCH")
                          .length,
                      0
                    )}
                  </strong>
                </span>
                <span>
                  Safety:{" "}
                  <strong className="text-gray-900">
                    {students.reduce(
                      (acc, s) =>
                        acc +
                        s.applications.filter((a) => a.category === "SAFETY")
                          .length,
                      0
                    )}
                  </strong>
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {Object.entries(countryMap).map(([country, count]) => (
                <Link
                  key={country}
                  href={`/students`}
                  className="px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-indigo-50/70 border border-gray-200/80 text-[12px] text-gray-700 font-medium transition flex items-center gap-2"
                >
                  <span>{country}</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-white text-gray-600 text-[11px] border border-gray-200">
                    {count}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Deadlines, Pending Docs & Notes */}
        <div className="space-y-5">
          {/* Upcoming Tasks */}
          <div className="rounded-xl border border-gray-200/90 bg-white overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[13px] font-semibold text-gray-900">
                <CalendarClock className="w-4 h-4 text-gray-400" />
                <span>Việc cần làm sắp đến hạn</span>
              </div>
              <span className="text-[11px] text-gray-400 font-medium">
                {upcomingTasks.length}
              </span>
            </div>
            <div className="divide-y divide-gray-100">
              {upcomingTasks.map((task) => (
                <Link
                  key={task.id}
                  href={`/students/${task.studentId}?tab=essays`}
                  className="block px-4 py-3 hover:bg-gray-50/70 transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[13px] font-medium text-gray-800 leading-snug">
                      {task.title}
                    </span>
                    <span className="text-[11px] text-rose-600 font-medium shrink-0">
                      {task.dueDate}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-400 mt-1">
                    {task.studentName} • {task.assigneeName}
                  </div>
                </Link>
              ))}
              {upcomingTasks.length === 0 && (
                <div className="p-5 text-center text-[12px] text-gray-400">
                  Không có công việc quá hạn
                </div>
              )}
            </div>
          </div>

          {/* Pending Documents */}
          <div className="rounded-xl border border-gray-200/90 bg-white overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[13px] font-semibold text-gray-900">
                <FileWarning className="w-4 h-4 text-gray-400" />
                <span>Giấy tờ chờ duyệt / bổ sung</span>
              </div>
              <span className="text-[11px] text-gray-400 font-medium">
                {pendingDocs.length}
              </span>
            </div>
            <div className="divide-y divide-gray-100">
              {pendingDocs.map((doc) => {
                const st =
                  DOC_STATUS_LABELS[doc.status] || DOC_STATUS_LABELS.MISSING;
                return (
                  <Link
                    key={doc.id}
                    href={`/students/${doc.studentId}?tab=documents`}
                    className="block px-4 py-3 hover:bg-gray-50/70 transition"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[12px] font-medium text-gray-800 truncate">
                        {doc.name}
                      </span>
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full border shrink-0 ${st.badge}`}
                      >
                        {st.label}
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-400 mt-0.5">
                      {doc.studentName}
                    </div>
                  </Link>
                );
              })}
              {pendingDocs.length === 0 && (
                <div className="p-5 text-center text-[12px] text-emerald-600 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Tất cả giấy tờ đã ổn định</span>
                </div>
              )}
            </div>
          </div>

          {/* Recent Internal Notes */}
          <div className="rounded-xl border border-gray-200/90 bg-white overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2 text-[13px] font-semibold text-gray-900">
              <MessageSquare className="w-4 h-4 text-gray-400" />
              <span>Trao đổi nội bộ gần đây</span>
            </div>
            <div className="divide-y divide-gray-100">
              {recentNotes.map((note) => (
                <div key={note.id} className="px-4 py-3 space-y-1">
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="font-medium text-gray-900">
                      {note.authorName}
                    </span>
                    <Link
                      href={`/students/${note.student.id}?tab=notes`}
                      className="text-indigo-600 hover:underline text-[11px]"
                    >
                      {note.student.fullName}
                    </Link>
                  </div>
                  <p className="text-[12px] text-gray-500 leading-relaxed line-clamp-2">
                    {note.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
