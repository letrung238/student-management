"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PIPELINE_STAGES } from "@/lib/constants";
import { ArrowRight, ArrowLeft, ExternalLink, FileText } from "lucide-react";

export default function PipelineBoardClient({
  students,
}: {
  students: any[];
}) {
  const router = useRouter();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const moveStage = async (studentId: string, targetStage: string) => {
    setUpdatingId(studentId);
    await fetch(`/api/students/${studentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pipelineStage: targetStage }),
    });
    setUpdatingId(null);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200/80">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 tracking-tight">
            Tiến độ 4 Bước
          </h2>
          <p className="text-[13px] text-gray-500 mt-0.5">
            Đang chuẩn bị hồ sơ → Đã nộp trường → Đang làm Visa → Đã có Visa / Hoàn tất.
          </p>
        </div>
        <Link
          href="/students"
          className="px-3.5 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-[13px] font-medium text-gray-700 w-fit transition"
        >
          Chế độ Bảng & Bộ lọc
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {PIPELINE_STAGES.map((stage, stageIdx) => {
          const stageStudents = students.filter(
            (s) => s.pipelineStage === stage.id
          );

          return (
            <div
              key={stage.id}
              className="bg-slate-100/80 rounded-2xl border border-slate-200/90 flex flex-col min-h-[540px]"
            >
              {/* Column Header */}
              <div
                className={`p-4 rounded-t-2xl border-b-2 ${stage.headerClass} flex items-center justify-between`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${stage.dotClass}`} />
                  <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wide">
                    {stage.label}
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-white text-slate-800 font-bold text-xs border border-slate-200">
                  {stageStudents.length}
                </span>
              </div>

              {/* Cards */}
              <div className="p-3 space-y-3 flex-1">
                {stageStudents.map((stu) => {
                  const prevStage =
                    stageIdx > 0 ? PIPELINE_STAGES[stageIdx - 1] : null;
                  const nextStage =
                    stageIdx < PIPELINE_STAGES.length - 1
                      ? PIPELINE_STAGES[stageIdx + 1]
                      : null;

                  return (
                    <div
                      key={stu.id}
                      className={`bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-md transition space-y-2.5 ${
                        updatingId === stu.id ? "opacity-50" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                            {stu.code}
                          </span>
                          <Link
                            href={`/students/${stu.id}`}
                            className="block font-bold text-sm text-slate-900 hover:text-blue-600 mt-1"
                          >
                            {stu.fullName}
                          </Link>
                        </div>
                        <Link
                          href={`/students/${stu.id}/brag-sheet`}
                          title="In Hồ sơ năng lực PDF"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </Link>
                      </div>

                      <div className="text-xs text-slate-600">
                        <div>{stu.currentSchool}</div>
                        <div className="font-semibold text-slate-800 mt-0.5">
                          GPA {stu.gpa} • {stu.englishTestType} {stu.englishScore}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {stu.targetCountries
                          .split(",")
                          .map((c: string) => c.trim())
                          .map((country: string) => (
                            <span
                              key={country}
                              className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold text-[10px] border border-blue-200"
                            >
                              {country}
                            </span>
                          ))}
                        <span className="text-[10px] text-slate-500 self-center">
                          ({stu.targetIntake})
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-500 border-t border-slate-100 pt-2">
                        Ngành:{" "}
                        <strong className="text-slate-700">
                          {stu.targetMajors}
                        </strong>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-1">
                          {prevStage && (
                            <button
                              type="button"
                              onClick={() => moveStage(stu.id, prevStage.id)}
                              title={`Lùi về: ${prevStage.shortLabel}`}
                              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 text-[11px]"
                            >
                              <ArrowLeft className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {nextStage && (
                            <button
                              type="button"
                              onClick={() => moveStage(stu.id, nextStage.id)}
                              title={`Chuyển sang: ${nextStage.shortLabel}`}
                              className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-blue-600 text-white text-[11px] font-medium flex items-center gap-1 transition"
                            >
                              <span>Bước tiếp</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                        <Link
                          href={`/students/${stu.id}`}
                          className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <span>Chi tiết</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  );
                })}

                {stageStudents.length === 0 && (
                  <div className="text-center py-12 text-xs text-slate-400">
                    Chưa có hồ sơ ở giai đoạn này
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
