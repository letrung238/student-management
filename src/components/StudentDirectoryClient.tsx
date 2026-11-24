"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  Plus,
  FileText,
  X,
  UserPlus,
  GraduationCap,
  ChevronDown,
  ChevronRight,
  Calendar,
  SlidersHorizontal,
} from "lucide-react";
import { PIPELINE_STAGES, COUNTRIES_LIST, ROLE_LABELS } from "@/lib/constants";

const STAGE_GROUP_STYLES: Record<string, string> = {
  PREPARING: "bg-amber-50/80 border-amber-200/70 text-amber-900",
  SUBMITTED: "bg-indigo-50/80 border-indigo-200/70 text-indigo-900",
  VISA_PROCESSING: "bg-purple-50/80 border-purple-200/70 text-purple-900",
  COMPLETED: "bg-emerald-50/80 border-emerald-200/70 text-emerald-900",
};

export default function StudentDirectoryClient({
  students,
  allUsers,
  currentUser,
}: {
  students: any[];
  allUsers: any[];
  currentUser: any;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialStage = searchParams.get("stage") || "ALL";
  const initialQ = searchParams.get("q") || "";

  const [viewMode, setViewMode] = useState<"grouped" | "table">("grouped");
  const [hideCompleted, setHideCompleted] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [showFilters, setShowFilters] = useState(false);

  // Bộ lọc nâng cao
  const [searchQuery, setSearchQuery] = useState(initialQ);
  const [countryFilter, setCountryFilter] = useState("ALL");
  const [stageFilter, setStageFilter] = useState(initialStage);
  const [intakeFilter, setIntakeFilter] = useState("ALL");
  const [staffFilter, setStaffFilter] = useState("ALL");
  const [minGpaFilter, setMinGpaFilter] = useState("");

  // Modal tạo học sinh mới
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "Nữ",
    dob: "2009-05-15",
    email: "",
    phone: "",
    currentSchool: "",
    currentGrade: "Lớp 12",
    gpa: "8.8",
    englishTestType: "IELTS",
    englishScore: "7.5",
    standardizedTests: "SAT: 1450",
    targetCountries: "Mỹ, Úc",
    targetIntake: "Fall 2027",
    targetDegree: "Cử nhân (Bachelor)",
    targetMajors: "Computer Science / Business Analytics",
    careerOrientation: "",
    skillsAndInterests: "",
    annualBudget: "$35,000 / năm",
    savingsAmount: "1,5 tỷ VNĐ",
    parentsIncome: "80 triệu VNĐ / tháng",
    scholarshipTarget: "Học bổng 30% - 50% học phí",
    pipelineStage: "PREPARING",
    assignedUserIds: [currentUser.id] as string[],
  });

  const intakes = useMemo(() => {
    const s = new Set<string>();
    students.forEach((stu) => {
      if (stu.targetIntake) s.add(stu.targetIntake);
    });
    return Array.from(s);
  }, [students]);

  const filteredStudents = useMemo(() => {
    return students.filter((stu) => {
      if (hideCompleted && stu.pipelineStage === "COMPLETED") return false;

      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const matchText =
          stu.fullName.toLowerCase().includes(q) ||
          stu.code.toLowerCase().includes(q) ||
          stu.currentSchool.toLowerCase().includes(q) ||
          stu.targetMajors.toLowerCase().includes(q) ||
          (stu.standardizedTests || "").toLowerCase().includes(q) ||
          stu.englishScore.toLowerCase().includes(q);
        if (!matchText) return false;
      }

      if (countryFilter !== "ALL") {
        const list = stu.targetCountries
          .split(",")
          .map((c: string) => c.trim().toLowerCase());
        if (!list.includes(countryFilter.toLowerCase())) return false;
      }

      if (stageFilter !== "ALL" && stu.pipelineStage !== stageFilter) {
        return false;
      }

      if (intakeFilter !== "ALL" && stu.targetIntake !== intakeFilter) {
        return false;
      }

      if (staffFilter !== "ALL") {
        const hasStaff = stu.assignments.some(
          (a: any) => a.userId === staffFilter
        );
        if (!hasStaff) return false;
      }

      if (minGpaFilter) {
        const minG = parseFloat(minGpaFilter);
        if (!isNaN(minG) && stu.gpa < minG) return false;
      }

      return true;
    });
  }, [
    students,
    hideCompleted,
    searchQuery,
    countryFilter,
    stageFilter,
    intakeFilter,
    staffFilter,
    minGpaFilter,
  ]);

  const toggleGroup = (stageId: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [stageId]: !prev[stageId] }));
  };

  const collapseAll = () => {
    const allCollapsed = PIPELINE_STAGES.every((s) => collapsedGroups[s.id]);
    const next: Record<string, boolean> = {};
    PIPELINE_STAGES.forEach((s) => {
      next[s.id] = !allCollapsed;
    });
    setCollapsedGroups(next);
  };

  const toggleStaffCheckbox = (uid: string) => {
    setFormData((prev) => {
      const exists = prev.assignedUserIds.includes(uid);
      return {
        ...prev,
        assignedUserIds: exists
          ? prev.assignedUserIds.filter((id) => id !== uid)
          : [...prev.assignedUserIds, uid],
      };
    });
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) return;
    setCreating(true);
    const res = await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    setCreating(false);
    setShowCreateModal(false);
    if (data.student?.id) {
      router.push(`/students/${data.student.id}`);
      router.refresh();
    }
  };

  const handleQuickStageChange = async (studentId: string, newStage: string) => {
    await fetch(`/api/students/${studentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pipelineStage: newStage }),
    });
    router.refresh();
  };

  const openModalForStage = (stageId: string) => {
    setFormData((prev) => ({ ...prev, pipelineStage: stageId }));
    setShowCreateModal(true);
  };

  return (
    <div className="space-y-4">
      {/* Breadcrumb + Clean Header (MentorOS Style) */}
      <div className="space-y-1">
        <div className="text-[12px] text-gray-400">
          Vận hành / <span className="text-gray-600">Hồ sơ Học sinh</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
            Hồ sơ Học sinh
          </h1>

          <div className="flex items-center gap-2.5 text-[12px] text-gray-500">
            <span>Phạm vi:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 font-medium">
              {currentUser.role === "ADMIN" ? "Toàn công ty" : currentUser.name}
            </span>
          </div>
        </div>
      </div>

      {/* Underline View Tabs */}
      <div className="flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={() => setViewMode("grouped")}
            className={`pb-2.5 text-[13px] font-medium border-b-2 transition ${
              viewMode === "grouped"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            Danh sách phân nhóm
          </button>
          <button
            type="button"
            onClick={() => setViewMode("table")}
            className={`pb-2.5 text-[13px] font-medium border-b-2 transition ${
              viewMode === "table"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            Bảng chi tiết
          </button>
          <Link
            href="/pipeline"
            className="pb-2.5 text-[13px] font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-800 transition"
          >
            Bảng Kanban 4 bước
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={`mb-1.5 px-2.5 py-1 rounded-lg text-[12px] font-medium inline-flex items-center gap-1.5 transition ${
            showFilters
              ? "bg-indigo-50 text-indigo-700"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Bộ lọc nâng cao</span>
        </button>
      </div>

      {/* Toolbar Row (Exact MentorOS feel: Count on left, Toggle + Collapse All + Pill Primary CTA on right) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="text-[12px] text-gray-500">
          {PIPELINE_STAGES.length} Giai đoạn •{" "}
          <strong className="text-gray-800">
            {filteredStudents.length} Hồ sơ học sinh
          </strong>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Toggle Ẩn hồ sơ đã hoàn tất */}
          <label className="inline-flex items-center gap-2 cursor-pointer text-[12px] text-gray-600 select-none">
            <button
              type="button"
              role="switch"
              aria-checked={hideCompleted}
              onClick={() => setHideCompleted(!hideCompleted)}
              className={`w-8 h-4.5 rounded-full transition-colors p-0.5 flex items-center ${
                hideCompleted ? "bg-indigo-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`w-3.5 h-3.5 rounded-full bg-white shadow-xs transition-transform ${
                  hideCompleted ? "translate-x-3.5" : "translate-x-0"
                }`}
              />
            </button>
            <span>Ẩn hồ sơ đã hoàn tất</span>
          </label>

          {viewMode === "grouped" && (
            <button
              type="button"
              onClick={collapseAll}
              className="text-[12px] text-gray-500 hover:text-gray-900 font-medium transition"
            >
              Thu gọn tất cả
            </button>
          )}

          <button
            type="button"
            onClick={() => openModalForStage("PREPARING")}
            className="px-3.5 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-[12px] font-medium shadow-2xs transition inline-flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm học sinh</span>
          </button>
        </div>
      </div>

      {/* Collapsible Advanced Filter Bar */}
      {showFilters && (
        <div className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-200/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5">
          <div className="lg:col-span-2 relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm tên HS, mã, trường, ngành, IELTS/SAT..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white border border-gray-200 text-[12px] focus:outline-none focus:border-indigo-400"
            />
          </div>
          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-gray-200 text-[12px] bg-white"
          >
            <option value="ALL">Tất cả Quốc gia</option>
            {COUNTRIES_LIST.map((c) => (
              <option key={c} value={c}>
                Du học {c}
              </option>
            ))}
          </select>
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-gray-200 text-[12px] bg-white"
          >
            <option value="ALL">Tất cả 4 Bước</option>
            {PIPELINE_STAGES.map((st) => (
              <option key={st.id} value={st.id}>
                {st.label}
              </option>
            ))}
          </select>
          <select
            value={staffFilter}
            onChange={(e) => setStaffFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-gray-200 text-[12px] bg-white"
          >
            <option value="ALL">Mọi Nhân viên</option>
            {allUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
          <div className="flex gap-1.5">
            <select
              value={intakeFilter}
              onChange={(e) => setIntakeFilter(e.target.value)}
              className="w-1/2 px-2 py-1.5 rounded-lg border border-gray-200 text-[12px] bg-white"
            >
              <option value="ALL">Kỳ học</option>
              {intakes.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
            <input
              type="number"
              step="0.1"
              value={minGpaFilter}
              onChange={(e) => setMinGpaFilter(e.target.value)}
              placeholder="GPA >="
              className="w-1/2 px-2 py-1.5 rounded-lg border border-gray-200 text-[12px] bg-white"
            />
          </div>
        </div>
      )}

      {/* VIEW 1: GROUPED COLLAPSIBLE LIST (Exact MentorOS List View) */}
      {viewMode === "grouped" && (
        <div className="space-y-3">
          {/* Column Header Row */}
          <div className="hidden md:grid grid-cols-12 gap-3 px-4 py-1.5 text-[11px] font-medium text-gray-400">
            <div className="col-span-4">Học sinh / Định hướng ngành</div>
            <div className="col-span-2">Người phụ trách</div>
            <div className="col-span-2">Trạng thái</div>
            <div className="col-span-2">Học thuật & Quốc gia</div>
            <div className="col-span-2 text-right">Kỳ nhập học & Thao tác</div>
          </div>

          {PIPELINE_STAGES.filter(
            (st) =>
              (!hideCompleted || st.id !== "COMPLETED") &&
              (stageFilter === "ALL" || stageFilter === st.id)
          ).map((stage) => {
            const stageStudents = filteredStudents.filter(
              (s) => s.pipelineStage === stage.id
            );
            const isCollapsed = !!collapsedGroups[stage.id];
            const groupStyle =
              STAGE_GROUP_STYLES[stage.id] ||
              "bg-gray-50 border-gray-200 text-gray-900";

            return (
              <div
                key={stage.id}
                className="rounded-xl border border-gray-200/80 bg-white overflow-hidden"
              >
                {/* Pastel Group Header Bar */}
                <div
                  className={`px-3.5 py-2.5 flex items-center justify-between gap-3 border-b ${
                    isCollapsed ? "border-b-0" : "border-gray-200/60"
                  } ${groupStyle}`}
                >
                  <button
                    type="button"
                    onClick={() => toggleGroup(stage.id)}
                    className="flex items-center gap-2 text-left min-w-0"
                  >
                    {isCollapsed ? (
                      <ChevronRight className="w-4 h-4 shrink-0 opacity-70" />
                    ) : (
                      <ChevronDown className="w-4 h-4 shrink-0 opacity-70" />
                    )}
                    <span className="text-[13px] font-semibold truncate">
                      {stage.shortLabel}
                    </span>
                    <span className="text-[11px] opacity-70 font-normal">
                      {stageStudents.length} Hồ sơ
                    </span>
                  </button>

                  <div className="flex items-center gap-3">
                    <span className="hidden sm:inline text-[11px] opacity-70">
                      {stage.description}
                    </span>
                    <button
                      type="button"
                      onClick={() => openModalForStage(stage.id)}
                      title={`Thêm học sinh vào bước "${stage.shortLabel}"`}
                      className="w-6 h-6 rounded-md hover:bg-black/5 flex items-center justify-center transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Indented Student Rows */}
                {!isCollapsed && (
                  <div className="divide-y divide-gray-100">
                    {stageStudents.map((stu) => {
                      const mainStaff = stu.assignments[0]?.user;
                      const extraStaffCount = Math.max(
                        0,
                        stu.assignments.length - 1
                      );
                      const approvedDocs = stu.documents.filter(
                        (d: any) => d.status === "APPROVED"
                      ).length;

                      return (
                        <div
                          key={stu.id}
                          className="grid grid-cols-1 md:grid-cols-12 gap-2.5 md:gap-3 px-4 py-2.5 items-center hover:bg-gray-50/70 transition text-[13px]"
                        >
                          {/* Student Name & Major */}
                          <div className="md:col-span-4 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-mono text-gray-400">
                                {stu.code}
                              </span>
                              <Link
                                href={`/students/${stu.id}`}
                                className="font-medium text-gray-900 hover:text-indigo-600 truncate"
                              >
                                {stu.fullName}
                              </Link>
                            </div>
                            <div className="text-[11px] text-gray-500 truncate mt-0.5">
                              {stu.targetMajors} • {stu.currentSchool}
                            </div>
                          </div>

                          {/* Assignee Avatar + Name */}
                          <div className="md:col-span-2 flex items-center gap-2 min-w-0">
                            {mainStaff ? (
                              <>
                                <div
                                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-semibold shrink-0"
                                  style={{
                                    backgroundColor: mainStaff.avatarColor,
                                  }}
                                >
                                  {mainStaff.name
                                    .split(" ")
                                    .slice(-2)
                                    .map((n: string) => n[0])
                                    .join("")}
                                </div>
                                <span className="text-[12px] text-gray-700 truncate">
                                  {mainStaff.name}
                                  {extraStaffCount > 0 && (
                                    <span className="text-gray-400 ml-1">
                                      +{extraStaffCount}
                                    </span>
                                  )}
                                </span>
                              </>
                            ) : (
                              <span className="text-[12px] text-gray-400">
                                Chưa phân công
                              </span>
                            )}
                          </div>

                          {/* Compact Status Dropdown Pill */}
                          <div className="md:col-span-2">
                            <select
                              value={stu.pipelineStage}
                              onChange={(e) =>
                                handleQuickStageChange(stu.id, e.target.value)
                              }
                              className={`text-[11px] font-medium px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none ${stage.badgeClass}`}
                            >
                              {PIPELINE_STAGES.map((st) => (
                                <option
                                  key={st.id}
                                  value={st.id}
                                  className="bg-white text-gray-900"
                                >
                                  {st.shortLabel}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Academic & Country */}
                          <div className="md:col-span-2 text-[12px] text-gray-600 space-y-0.5">
                            <div className="font-medium text-gray-800 truncate">
                              {stu.targetCountries} • GPA {stu.gpa}
                            </div>
                            <div className="text-[11px] text-gray-400 truncate">
                              {stu.englishTestType} {stu.englishScore} •{" "}
                              {approvedDocs}/{stu.documents.length} giấy tờ
                            </div>
                          </div>

                          {/* Intake & Actions */}
                          <div className="md:col-span-2 flex items-center md:justify-end gap-2">
                            <span className="inline-flex items-center gap-1 text-[11px] text-gray-500">
                              <Calendar className="w-3 h-3 text-gray-400" />
                              {stu.targetIntake}
                            </span>
                            <Link
                              href={`/students/${stu.id}/brag-sheet`}
                              title="Xuất PDF Hồ sơ năng lực"
                              className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </Link>
                            <Link
                              href={`/students/${stu.id}`}
                              className="px-2.5 py-1 rounded-md bg-gray-100 hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 text-[11px] font-medium transition"
                            >
                              Mở
                            </Link>
                          </div>
                        </div>
                      );
                    })}

                    {stageStudents.length === 0 && (
                      <div className="px-4 py-4 text-[12px] text-gray-400">
                        Chưa có học sinh nào ở giai đoạn này.
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: FLAT CLEAN TABLE */}
      {viewMode === "table" && (
        <div className="rounded-xl border border-gray-200/90 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[13px]">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-200/80 text-[11px] font-medium text-gray-500">
                  <th className="py-2.5 px-4">Học sinh</th>
                  <th className="py-2.5 px-4">Học thuật</th>
                  <th className="py-2.5 px-4">Quốc gia & Ngành</th>
                  <th className="py-2.5 px-4">Tài chính & Học bổng</th>
                  <th className="py-2.5 px-4">Phụ trách</th>
                  <th className="py-2.5 px-4">Trạng thái</th>
                  <th className="py-2.5 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStudents.map((stu) => {
                  const stageMeta =
                    PIPELINE_STAGES.find((s) => s.id === stu.pipelineStage) ||
                    PIPELINE_STAGES[0];
                  return (
                    <tr key={stu.id} className="hover:bg-gray-50/70 transition">
                      <td className="py-3 px-4">
                        <Link
                          href={`/students/${stu.id}`}
                          className="font-medium text-gray-900 hover:text-indigo-600"
                        >
                          {stu.fullName}
                        </Link>
                        <div className="text-[11px] text-gray-400">
                          {stu.code} • {stu.currentSchool}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[12px]">
                        <div className="font-medium text-gray-800">
                          GPA {stu.gpa}/{stu.gpaScale}
                        </div>
                        <div className="text-gray-500">
                          {stu.englishTestType} {stu.englishScore}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[12px]">
                        <div className="font-medium text-gray-800">
                          {stu.targetCountries} ({stu.targetIntake})
                        </div>
                        <div className="text-gray-500 truncate max-w-[200px]">
                          {stu.targetMajors}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[12px]">
                        <div className="text-gray-800">{stu.annualBudget}</div>
                        <div className="text-[11px] text-emerald-700 truncate max-w-[180px]">
                          {stu.scholarshipTarget}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[12px] text-gray-600">
                        {stu.assignments
                          .map((a: any) => a.user.name.split(" ").slice(-2).join(" "))
                          .join(", ")}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={stu.pipelineStage}
                          onChange={(e) =>
                            handleQuickStageChange(stu.id, e.target.value)
                          }
                          className={`text-[11px] font-medium px-2.5 py-1 rounded-full border ${stageMeta.badgeClass}`}
                        >
                          {PIPELINE_STAGES.map((st) => (
                            <option
                              key={st.id}
                              value={st.id}
                              className="bg-white text-gray-900"
                            >
                              {st.shortLabel}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/students/${stu.id}`}
                          className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-[12px] font-medium hover:bg-indigo-100"
                        >
                          Chi tiết
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Tạo Hồ sơ Học sinh Mới */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full shadow-xl border border-gray-200 overflow-hidden my-8">
            <div className="px-5 py-3.5 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                <h3 className="font-semibold text-[15px] text-gray-900">
                  Thêm Hồ sơ Học sinh Mới
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleCreateStudent}
              className="p-5 space-y-4 max-h-[80vh] overflow-y-auto text-[12px]"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Họ và tên học sinh *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    placeholder="VD: Phạm Hoàng Minh"
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Trường đang học
                  </label>
                  <input
                    type="text"
                    value={formData.currentSchool}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        currentSchool: e.target.value,
                      })
                    }
                    placeholder="VD: THPT Chuyên Ngoại Ngữ"
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    GPA & IELTS/Ngoại ngữ
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <input
                      type="number"
                      step="0.1"
                      value={formData.gpa}
                      onChange={(e) =>
                        setFormData({ ...formData, gpa: e.target.value })
                      }
                      placeholder="9.0"
                      className="px-2.5 py-1.5 rounded-lg border border-gray-300"
                    />
                    <input
                      type="text"
                      value={formData.englishScore}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          englishScore: e.target.value,
                        })
                      }
                      placeholder="IELTS 7.5"
                      className="px-2.5 py-1.5 rounded-lg border border-gray-300"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Quốc gia mục tiêu
                  </label>
                  <input
                    type="text"
                    value={formData.targetCountries}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        targetCountries: e.target.value,
                      })
                    }
                    placeholder="Mỹ, Canada, Úc"
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Kỳ nhập học
                  </label>
                  <input
                    type="text"
                    value={formData.targetIntake}
                    onChange={(e) =>
                      setFormData({ ...formData, targetIntake: e.target.value })
                    }
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Định hướng ngành học
                  </label>
                  <input
                    type="text"
                    value={formData.targetMajors}
                    onChange={(e) =>
                      setFormData({ ...formData, targetMajors: e.target.value })
                    }
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Ngân sách gia đình / năm
                  </label>
                  <input
                    type="text"
                    value={formData.annualBudget}
                    onChange={(e) =>
                      setFormData({ ...formData, annualBudget: e.target.value })
                    }
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Mục tiêu Học bổng
                  </label>
                  <input
                    type="text"
                    value={formData.scholarshipTarget}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        scholarshipTarget: e.target.value,
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Bước tiến độ ban đầu
                  </label>
                  <select
                    value={formData.pipelineStage}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pipelineStage: e.target.value,
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 bg-white"
                  >
                    {PIPELINE_STAGES.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.shortLabel}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <div className="font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <UserPlus className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Gắn nhóm nhân viên phụ trách hồ sơ</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {allUsers.map((u) => {
                    const checked = formData.assignedUserIds.includes(u.id);
                    return (
                      <label
                        key={u.id}
                        className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition ${
                          checked
                            ? "bg-indigo-50/70 border-indigo-300"
                            : "bg-white border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleStaffCheckbox(u.id)}
                          className="rounded text-indigo-600"
                        />
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900 truncate">
                            {u.name}
                          </div>
                          <div className="text-[11px] text-gray-500">
                            {ROLE_LABELS[u.role]?.label}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-gray-200 text-gray-600 font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
                >
                  {creating ? "Đang tạo..." : "Tạo hồ sơ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
