"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Printer, Award, Activity, GraduationCap, Compass, Wallet, Building2 } from "lucide-react";
import { APP_CATEGORY_LABELS } from "@/lib/constants";

export default function BragSheetClient({ student }: { student: any }) {
  return (
    <div className="space-y-6">
      {/* Thanh điều khiển không in (no-print) */}
      <div className="no-print flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <Link
          href={`/students/${student.id}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-blue-600"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Hồ sơ 360° của {student.fullName}</span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500">
            Bản chuẩn dùng gửi Cố vấn viết luận, Người giới thiệu (LOR) hoặc Đối tác trường
          </span>
          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>In / Lưu thành File PDF</span>
          </button>
        </div>
      </div>

      {/* Khung A4 Hồ sơ Năng lực Học sinh (Student Profile & Brag Sheet) */}
      <div className="print-container bg-white rounded-2xl border border-slate-200 p-8 md:p-10 shadow-sm max-w-4xl mx-auto space-y-6 text-slate-900">
        {/* Header Hồ sơ năng lực */}
        <div className="border-b-2 border-slate-900 pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-blue-600">
              EDUPATH GLOBAL — HỒ SƠ NĂNG LỰC HỌC SINH DU HỌC (STUDENT BRAG SHEET)
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mt-1">
              {student.fullName}
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              {student.currentSchool} ({student.currentGrade}) • Mã HS:{" "}
              <strong>{student.code}</strong> • Ngày sinh: {student.dob}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Email: {student.email} • Điện thoại: {student.phone} • Địa chỉ:{" "}
              {student.address}
            </p>
          </div>

          <div className="sm:text-right space-y-1 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
            <div>
              Quốc gia mục tiêu:{" "}
              <strong className="text-blue-700">{student.targetCountries}</strong>
            </div>
            <div>
              Kỳ nhập học: <strong>{student.targetIntake}</strong> ({student.targetDegree})
            </div>
            <div>
              Chuyên ngành: <strong>{student.targetMajors}</strong>
            </div>
          </div>
        </div>

        {/* 1. Thương hiệu cá nhân & Định hướng ngành nghề */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 space-y-1.5">
            <div className="font-bold text-blue-950 flex items-center gap-1.5 text-sm">
              <Compass className="w-4 h-4 text-blue-600" />
              <span>1. Định hướng Ngành nghề & Mục tiêu Sự nghiệp</span>
            </div>
            {student.strengthsSummary && (
              <p className="font-semibold text-slate-800">
                Điểm mạnh cốt lõi: {student.strengthsSummary}
              </p>
            )}
            <p className="text-slate-700 leading-relaxed whitespace-pre-line">
              {student.careerOrientation}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
              <span>2. Kỹ năng, Sở thích & Năng lực Cá nhân</span>
            </div>
            <p className="text-slate-700 leading-relaxed whitespace-pre-line">
              {student.skillsAndInterests}
            </p>
          </div>
        </div>

        {/* 2. Năng lực Học thuật & Chứng chỉ chuẩn hóa */}
        <div className="space-y-2.5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1.5 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            <span>3. Hồ sơ Học thuật & Điểm Chuẩn hóa Quốc tế</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-slate-500">Điểm trung bình (GPA)</div>
              <div className="text-lg font-extrabold text-slate-900">
                {student.gpa} / {student.gpaScale}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-slate-500">Ngoại ngữ ({student.englishTestType})</div>
              <div className="text-sm font-extrabold text-blue-700 mt-0.5">
                {student.englishScore}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-slate-500">Chứng chỉ Chuẩn hóa khác</div>
              <div className="text-xs font-bold text-slate-900 mt-0.5">
                {student.standardizedTests || "Chưa cập nhật"}
              </div>
            </div>
          </div>

          {student.academics.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
              {student.academics.map((rec: any) => (
                <div
                  key={rec.id}
                  className="p-2.5 rounded-lg border border-slate-200 flex items-center justify-between"
                >
                  <div>
                    <strong>{rec.levelName}</strong> ({rec.year})
                    <div className="text-slate-600">{rec.scoreDetail}</div>
                  </div>
                  <span className="text-[11px] text-slate-500">{rec.notes}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. Giải thưởng & Thành tích */}
        <div className="space-y-2.5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1.5 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-600" />
            <span>
              4. Giải thưởng & Thành tích Nổi bật ({student.awards.length})
            </span>
          </h2>
          <div className="space-y-2 text-xs">
            {student.awards.map((aw: any) => (
              <div
                key={aw.id}
                className="p-3 rounded-xl border border-slate-200 flex items-start justify-between gap-4"
              >
                <div>
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px] mr-2">
                    Cấp {aw.level}
                  </span>
                  <strong className="text-slate-900">{aw.title}</strong> ({aw.year})
                  <div className="text-slate-600 mt-0.5">
                    Đơn vị cấp: {aw.issuer}
                    {aw.description && ` — ${aw.description}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Hoạt động Ngoại khóa & Dự án */}
        <div className="space-y-2.5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1.5 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-600" />
            <span>
              5. Hoạt động Ngoại khóa, Nghiên cứu & Lãnh đạo ({student.extracurriculars.length})
            </span>
          </h2>
          <div className="space-y-2.5 text-xs">
            {student.extracurriculars.map((ex: any) => (
              <div
                key={ex.id}
                className="p-3.5 rounded-xl border border-slate-200 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <strong className="text-sm text-slate-900">{ex.title}</strong>
                  <span className="text-slate-500 font-medium">
                    {ex.duration}
                  </span>
                </div>
                <div className="text-blue-700 font-semibold">
                  Vai trò: {ex.role} • Tổ chức: {ex.organization} ({ex.category})
                </div>
                <p className="text-slate-700 leading-relaxed">
                  {ex.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Danh sách Trường Mục tiêu & Hồ sơ Tài chính */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
          <div className="p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>6. Danh sách Trường Mục tiêu ({student.applications.length})</span>
            </div>
            <div className="space-y-1.5">
              {student.applications.map((app: any) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between border-b border-slate-100 pb-1"
                >
                  <div>
                    <strong>{app.school?.name}</strong> ({app.major})
                  </div>
                  <span className="font-bold text-slate-700">
                    [{app.category}]
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 space-y-1.5">
            <div className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
              <Wallet className="w-4 h-4 text-emerald-600" />
              <span>7. Tóm tắt Hồ sơ Tài chính & Học bổng</span>
            </div>
            <div>
              • Ngân sách gia đình: <strong>{student.annualBudget}</strong>
            </div>
            <div>
              • Sổ tiết kiệm chứng minh: <strong>{student.savingsAmount}</strong>
            </div>
            <div>
              • Mục tiêu Học bổng: <strong>{student.scholarshipTarget}</strong>
            </div>
            <div>
              • Phụ huynh bảo lãnh: {student.parentName} ({student.parentOccupation})
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
