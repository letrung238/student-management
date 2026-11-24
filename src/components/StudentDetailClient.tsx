"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  PIPELINE_STAGES,
  DOC_STATUS_LABELS,
  ESSAY_STATUS_LABELS,
  APP_CATEGORY_LABELS,
  COUNTRIES_LIST,
  ROLE_LABELS,
} from "@/lib/constants";
import {
  ArrowLeft,
  Printer,
  User,
  GraduationCap,
  Award,
  Activity,
  Wallet,
  Building2,
  FileEdit,
  FileCheck2,
  MessageSquare,
  Plus,
  Trash2,
  ExternalLink,
  Upload,
  CheckCircle2,
  Clock,
  UserPlus,
  Compass,
  Sparkles,
  Save,
} from "lucide-react";

export default function StudentDetailClient({
  student,
  allUsers,
  allSchools,
  currentUser,
}: {
  student: any;
  allUsers: any[];
  allSchools: any[];
  currentUser: any;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "overview";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  // State cho thông tin gốc của học sinh (Cá nhân, Định hướng, Kỹ năng, Tài chính)
  const [profileForm, setProfileForm] = useState({
    fullName: student.fullName || "",
    gender: student.gender || "Nữ",
    dob: student.dob || "",
    email: student.email || "",
    phone: student.phone || "",
    address: student.address || "",
    passportNumber: student.passportNumber || "",
    passportExpiry: student.passportExpiry || "",
    parentName: student.parentName || "",
    parentPhone: student.parentPhone || "",
    parentOccupation: student.parentOccupation || "",
    currentSchool: student.currentSchool || "",
    currentGrade: student.currentGrade || "",
    gpa: String(student.gpa || ""),
    gpaScale: student.gpaScale || "10.0",
    englishTestType: student.englishTestType || "IELTS",
    englishScore: student.englishScore || "",
    standardizedTests: student.standardizedTests || "",
    targetCountries: student.targetCountries || "",
    targetIntake: student.targetIntake || "",
    targetDegree: student.targetDegree || "",
    targetMajors: student.targetMajors || "",
    careerOrientation: student.careerOrientation || "",
    skillsAndInterests: student.skillsAndInterests || "",
    strengthsSummary: student.strengthsSummary || "",
    annualBudget: student.annualBudget || "",
    savingsAmount: student.savingsAmount || "",
    parentsIncome: student.parentsIncome || "",
    assetsInfo: student.assetsInfo || "",
    scholarshipTarget: student.scholarshipTarget || "",
  });

  // State thêm nhân viên phụ trách
  const [newAssignUserId, setNewAssignUserId] = useState(allUsers[0]?.id || "");
  const [newAssignRoleLabel, setNewAssignRoleLabel] = useState(
    "Phụ trách phối hợp"
  );

  // State thêm bảng điểm / chứng chỉ học thuật
  const [newAcademic, setNewAcademic] = useState({
    levelName: "",
    institution: student.currentSchool,
    year: "2025 - 2026",
    scoreDetail: "",
    notes: "",
  });

  // State thêm hoạt động ngoại khóa
  const [newExtra, setNewExtra] = useState({
    title: "",
    organization: "",
    role: "",
    category: "Lãnh đạo & Cộng đồng",
    duration: "",
    description: "",
    proofUrl: "",
  });

  // State thêm giải thưởng
  const [newAward, setNewAward] = useState({
    title: "",
    level: "Quốc gia",
    issuer: "",
    year: "2026",
    description: "",
    proofUrl: "",
  });

  // State thêm Nguyện vọng trường (Chọn từ danh mục hoặc nhập trường mới)
  const [useNewSchoolInput, setUseNewSchoolInput] = useState(false);
  const [newApp, setNewApp] = useState({
    schoolId: allSchools[0]?.id || "",
    newSchoolName: "",
    newSchoolCountry: "Mỹ",
    newSchoolRanking: "",
    major: student.targetMajors.split(",")[0] || "",
    degreeLevel: "Cử nhân",
    intake: student.targetIntake,
    category: "MATCH",
    status: "PREPARING",
    deadline: "2027-01-15",
    scholarshipResult: "",
    notes: "",
  });

  // State thêm bài luận
  const [newEssay, setNewEssay] = useState({
    title: "",
    essayType: "Personal Statement",
    targetSchool: "Common App",
    wordCountTarget: "650",
    status: "DRAFTING",
    externalUrl: "",
    fileUrl: "",
    fileName: "",
    feedback: "",
  });

  // State thêm thư giới thiệu (LOR)
  const [newLor, setNewLor] = useState({
    recommenderName: "",
    recommenderTitle: "",
    recommenderEmail: "",
    relationship: "Giáo viên bộ môn / Chủ nhiệm",
    status: "REQUESTED",
    externalUrl: "",
    notes: "",
  });

  // State thêm công việc lộ trình (Task)
  const [newTask, setNewTask] = useState({
    title: "",
    category: "Hồ sơ trường",
    dueDate: "2026-12-10",
    priority: "HIGH",
    assigneeName: currentUser.name,
  });

  // State thêm giấy tờ mới
  const [newDoc, setNewDoc] = useState({
    name: "",
    category: "Học thuật",
    country: student.targetCountries.split(",")[0]?.trim() || "Mỹ",
    status: "PENDING_REVIEW",
    externalUrl: "",
    fileUrl: "",
    fileName: "",
    reviewerNote: "",
  });
  const [templateCountryToLoad, setTemplateCountryToLoad] = useState("Mỹ");

  // State thêm ghi chú nội bộ
  const [newNoteContent, setNewNoteContent] = useState("");

  // Helpers gọi API
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    await fetch(`/api/students/${student.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profileForm),
    });
    setSavingProfile(false);
    showToast("Đã lưu cập nhật thông tin hồ sơ học sinh!");
    router.refresh();
  };

  const handleStageChange = async (newStage: string) => {
    await fetch(`/api/students/${student.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pipelineStage: newStage }),
    });
    showToast("Đã cập nhật giai đoạn tiến độ hồ sơ!");
    router.refresh();
  };

  const postRecord = async (type: string, action: string, payload: any) => {
    const res = await fetch(`/api/students/${student.id}/records`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, action, payload }),
    });
    if (res.ok) {
      showToast("Đã cập nhật dữ liệu thành công!");
      router.refresh();
    }
  };

  const handleFileUpload = async (
    file: File,
    onUploaded: (fileUrl: string, fileName: string) => void
  ) => {
    setUploadingFile(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", {
      method: "POST",
      body: fd,
    });
    const data = await res.json();
    setUploadingFile(false);
    if (data.fileUrl) {
      onUploaded(data.fileUrl, data.fileName);
      showToast(`Đã tải file "${data.fileName}" lên hệ thống!`);
    }
  };

  const tabs = [
    {
      id: "overview",
      label: "1. Cá nhân, Kỹ năng & Định hướng",
      icon: Compass,
    },
    {
      id: "academics",
      label: `2. Học thuật, Ngoại khóa (${student.extracurriculars.length}) & Giải thưởng (${student.awards.length})`,
      icon: Award,
    },
    {
      id: "financial",
      label: "3. Hồ sơ Tài chính Gia đình",
      icon: Wallet,
    },
    {
      id: "applications",
      label: `4. Nguyện vọng Trường (${student.applications.length})`,
      icon: Building2,
    },
    {
      id: "essays",
      label: `5. Bài luận (${student.essays.length}), LOR & Lộ trình`,
      icon: FileEdit,
    },
    {
      id: "documents",
      label: `6. Checklist Giấy tờ (${student.documents.length})`,
      icon: FileCheck2,
    },
    {
      id: "notes",
      label: `7. Nhật ký Nội bộ (${student.activityNotes.length})`,
      icon: MessageSquare,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toast thông báo */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Breadcrumb & Clean Header (MentorOS Detail Style) */}
      <div className="space-y-4">
        <div className="text-[12px] text-gray-400 flex items-center gap-1.5">
          <Link href="/students" className="hover:text-gray-700 transition">
            Học sinh
          </Link>
          <span>/</span>
          <span className="text-gray-600 font-medium">{student.fullName}</span>
          <span className="font-mono text-[11px] text-gray-400">
            ({student.code})
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
                {student.fullName}
              </h1>
              <span className="text-[12px] text-gray-500">
                {student.currentSchool} • GPA {student.gpa}/{student.gpaScale} •{" "}
                {student.englishTestType} {student.englishScore}
              </span>
            </div>
            <div className="text-[12px] text-gray-500 flex flex-wrap items-center gap-2">
              <span>
                Mục tiêu: <strong className="text-gray-800">{student.targetCountries}</strong> ({student.targetIntake})
              </span>
              <span className="text-gray-300">•</span>
              <span>
                Ngành: <strong className="text-gray-800">{student.targetMajors}</strong>
              </span>
              <span className="text-gray-300">•</span>
              <span>
                Ngân sách: <strong className="text-emerald-700">{student.annualBudget}</strong>
              </span>
            </div>
          </div>

          {/* Right Compact Metadata Strip (Staff Avatars + Stage Pill + Export PDF) */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[12px] text-gray-400">Phụ trách:</span>
              <div className="flex -space-x-1.5">
                {student.assignments.map((asg: any) => (
                  <div
                    key={asg.id}
                    title={`${asg.user.name} (${asg.roleLabel})`}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-semibold ring-2 ring-white"
                    style={{ backgroundColor: asg.user.avatarColor }}
                  >
                    {asg.user.name
                      .split(" ")
                      .slice(-2)
                      .map((n: string) => n[0])
                      .join("")}
                  </div>
                ))}
              </div>
              <select
                value={newAssignUserId}
                onChange={(e) => {
                  setNewAssignUserId(e.target.value);
                  if (e.target.value) {
                    postRecord("assignment", "add", {
                      userId: e.target.value,
                      roleLabel: newAssignRoleLabel,
                    });
                  }
                }}
                title="Gắn thêm nhân viên phụ trách"
                className="w-6 h-6 rounded-full border border-dashed border-gray-300 text-gray-500 text-center text-xs cursor-pointer bg-white hover:border-indigo-400"
              >
                <option value="">+</option>
                {allUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    + {u.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 4-Step Pipeline Pill Selector */}
            <select
              value={student.pipelineStage}
              onChange={(e) => handleStageChange(e.target.value)}
              className="px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80 text-[12px] font-medium cursor-pointer focus:outline-none"
            >
              {PIPELINE_STAGES.map((st) => (
                <option key={st.id} value={st.id} className="bg-white text-gray-900">
                  {st.label}
                </option>
              ))}
            </select>

            <Link
              href={`/students/${student.id}/brag-sheet`}
              className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-[12px] font-medium flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5 text-gray-500" />
              <span>Xuất PDF</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Clean Underline Navigation Tabs */}
      <div className="flex items-center gap-5 overflow-x-auto border-b border-gray-200">
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`pb-2.5 text-[13px] font-medium transition shrink-0 border-b-2 ${
                active
                  ? "text-indigo-600 border-indigo-600"
                  : "text-gray-500 border-transparent hover:text-gray-800"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: THÔNG TIN CÁ NHÂN, KỸ NĂNG/SỞ THÍCH/NĂNG LỰC & ĐỊNH HƯỚNG NGÀNH NGHỀ */}
      {activeTab === "overview" && (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Khối Định hướng Ngành nghề & Kỹ năng/Sở thích/Năng lực cá nhân */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <span>
                  Định hướng Ngành nghề, Kỹ năng, Sở thích & Năng lực Cá nhân
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Quốc gia du học mục tiêu
                  </label>
                  <input
                    type="text"
                    value={profileForm.targetCountries}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        targetCountries: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Kỳ nhập học & Bậc học
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <input
                      type="text"
                      value={profileForm.targetIntake}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          targetIntake: e.target.value,
                        })
                      }
                      className="px-2.5 py-2 rounded-xl border border-slate-300"
                    />
                    <input
                      type="text"
                      value={profileForm.targetDegree}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          targetDegree: e.target.value,
                        })
                      }
                      className="px-2.5 py-2 rounded-xl border border-slate-300"
                    />
                  </div>
                </div>
              </div>

              <div className="text-xs">
                <label className="block font-semibold text-slate-700 mb-1">
                  Nhóm Ngành học mục tiêu (Target Majors)
                </label>
                <input
                  type="text"
                  value={profileForm.targetMajors}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      targetMajors: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-blue-950"
                />
              </div>

              <div className="text-xs">
                <label className="block font-semibold text-slate-700 mb-1">
                  Tóm tắt Điểm mạnh nổi bật / Thương hiệu Cá nhân (Personal Brand / Hook)
                </label>
                <textarea
                  rows={2}
                  value={profileForm.strengthsSummary}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      strengthsSummary: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="text-xs">
                <label className="block font-semibold text-slate-700 mb-1">
                  Kỹ năng, Sở thích & Năng lực Cá nhân (Skills, Interests & Personal Competencies)
                </label>
                <textarea
                  rows={4}
                  value={profileForm.skillsAndInterests}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      skillsAndInterests: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 leading-relaxed"
                />
              </div>

              <div className="text-xs">
                <label className="block font-semibold text-slate-700 mb-1">
                  Định hướng Ngành nghề & Kế hoạch Sự nghiệp Dài hạn (Career Orientation)
                </label>
                <textarea
                  rows={4}
                  value={profileForm.careerOrientation}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      careerOrientation: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 leading-relaxed"
                />
              </div>
            </div>

            {/* Khối Thông tin Cá nhân, Hộ chiếu & Gia đình */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
                <User className="w-5 h-5 text-blue-600" />
                <span>Thông tin Cá nhân, Hộ chiếu & Phụ huynh</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Họ và tên học sinh
                  </label>
                  <input
                    type="text"
                    value={profileForm.fullName}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, fullName: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Giới tính
                    </label>
                    <select
                      value={profileForm.gender}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, gender: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Ngày sinh
                    </label>
                    <input
                      type="date"
                      value={profileForm.dob}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, dob: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Email học sinh
                  </label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, email: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Số điện thoại học sinh
                  </label>
                  <input
                    type="text"
                    value={profileForm.phone}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Địa chỉ thường trú
                  </label>
                  <input
                    type="text"
                    value={profileForm.address}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, address: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Số Hộ chiếu (Passport No.)
                  </label>
                  <input
                    type="text"
                    value={profileForm.passportNumber}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        passportNumber: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Ngày hết hạn Hộ chiếu
                  </label>
                  <input
                    type="date"
                    value={profileForm.passportExpiry}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        passportExpiry: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>

                <div className="sm:col-span-2 pt-2 border-t border-slate-100">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Họ tên Phụ huynh / Người bảo lãnh
                  </label>
                  <input
                    type="text"
                    value={profileForm.parentName}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        parentName: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Số điện thoại Phụ huynh
                  </label>
                  <input
                    type="text"
                    value={profileForm.parentPhone}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        parentPhone: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nghề nghiệp / Chức vụ Bố Mẹ
                  </label>
                  <input
                    type="text"
                    value={profileForm.parentOccupation}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        parentOccupation: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm flex items-center gap-2 transition"
                >
                  <Save className="w-4 h-4" />
                  <span>
                    {savingProfile
                      ? "Đang lưu thông tin..."
                      : "Lưu Cập Nhật Hồ Sơ Gốc"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: HỌC THUẬT, HOẠT ĐỘNG NGOẠI KHÓA & GIẢI THƯỞNG / THÀNH TÍCH */}
      {activeTab === "academics" && (
        <div className="space-y-6">
          {/* Tóm tắt điểm số học thuật chuẩn hóa */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-base font-bold text-slate-900">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                <span>1. Hồ sơ Học thuật, Điểm GPA & Chứng chỉ Chuẩn hóa</span>
              </div>
              <button
                type="button"
                onClick={handleSaveProfile}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold w-fit"
              >
                Lưu chỉ số GPA / Ngoại ngữ
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Trường hiện tại
                </label>
                <input
                  type="text"
                  value={profileForm.currentSchool}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      currentSchool: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Lớp & GPA trung bình
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <input
                    type="text"
                    value={profileForm.currentGrade}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        currentGrade: e.target.value,
                      })
                    }
                    className="px-2.5 py-2 rounded-xl border border-slate-300"
                  />
                  <input
                    type="number"
                    step="0.1"
                    value={profileForm.gpa}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, gpa: e.target.value })
                    }
                    className="px-2.5 py-2 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Chứng chỉ Ngoại ngữ chính
                </label>
                <input
                  type="text"
                  value={profileForm.englishScore}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      englishScore: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-blue-700"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  SAT / ACT / AP / IB / TOPIK / JLPT
                </label>
                <input
                  type="text"
                  value={profileForm.standardizedTests}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      standardizedTests: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>
            </div>

            {/* Danh sách từng học kỳ / bài thi chi tiết */}
            <div className="space-y-2 pt-2">
              {student.academics.map((rec: any) => (
                <div
                  key={rec.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4 text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900">
                      {rec.levelName}
                    </span>{" "}
                    • <span className="text-slate-600">{rec.institution}</span>{" "}
                    <span className="text-slate-400">({rec.year})</span>
                    <div className="text-blue-700 font-semibold mt-0.5">
                      Kết quả: {rec.scoreDetail}
                      {rec.notes && (
                        <span className="text-slate-500 font-normal">
                          {" "}
                          — {rec.notes}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      postRecord("academic", "delete", { id: rec.id })
                    }
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Form thêm dòng học thuật */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-2 border-t border-slate-100 text-xs">
              <input
                type="text"
                placeholder="Hạng mục (VD: Lớp 12 / SAT / IELTS)"
                value={newAcademic.levelName}
                onChange={(e) =>
                  setNewAcademic({ ...newAcademic, levelName: e.target.value })
                }
                className="px-3 py-2 rounded-xl border border-slate-200"
              />
              <input
                type="text"
                placeholder="Trường / Đơn vị tổ chức"
                value={newAcademic.institution}
                onChange={(e) =>
                  setNewAcademic({
                    ...newAcademic,
                    institution: e.target.value,
                  })
                }
                className="px-3 py-2 rounded-xl border border-slate-200"
              />
              <input
                type="text"
                placeholder="Năm học / Ngày thi"
                value={newAcademic.year}
                onChange={(e) =>
                  setNewAcademic({ ...newAcademic, year: e.target.value })
                }
                className="px-3 py-2 rounded-xl border border-slate-200"
              />
              <input
                type="text"
                placeholder="Điểm số chi tiết (VD: GPA 9.5)"
                value={newAcademic.scoreDetail}
                onChange={(e) =>
                  setNewAcademic({
                    ...newAcademic,
                    scoreDetail: e.target.value,
                  })
                }
                className="px-3 py-2 rounded-xl border border-slate-200"
              />
              <button
                type="button"
                onClick={() => {
                  if (!newAcademic.levelName || !newAcademic.scoreDetail) return;
                  postRecord("academic", "create", newAcademic);
                  setNewAcademic({
                    ...newAcademic,
                    levelName: "",
                    scoreDetail: "",
                  });
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-semibold flex items-center justify-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Bảng điểm/Điểm thi</span>
              </button>
            </div>
          </div>

          {/* 2. HOẠT ĐỘNG NGOẠI KHÓA (EXTRACURRICULARS) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-base font-bold text-slate-900">
                <Activity className="w-5 h-5 text-emerald-600" />
                <span>
                  2. Hoạt động Ngoại khóa, Dự án Nghiên cứu & Lãnh đạo ({student.extracurriculars.length})
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {student.extracurriculars.map((ex: any) => (
                <div
                  key={ex.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between gap-3 text-xs"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        {ex.category}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          postRecord("extracurricular", "delete", { id: ex.id })
                        }
                        className="text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900">
                      {ex.title}
                    </h4>
                    <div className="text-slate-600 font-medium">
                      Vai trò: <strong className="text-blue-700">{ex.role}</strong> •{" "}
                      {ex.organization}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Thời gian tham gia: {ex.duration}
                    </div>
                    <p className="text-slate-700 leading-relaxed pt-1">
                      {ex.description}
                    </p>
                  </div>

                  {ex.proofUrl && (
                    <a
                      href={ex.proofUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 font-semibold hover:underline inline-flex items-center gap-1 text-[11px]"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Xem Link Minh chứng / Portfolio Dự án</span>
                    </a>
                  )}
                </div>
              ))}
            </div>

            {/* Form thêm hoạt động ngoại khóa */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <div className="font-bold text-slate-800">
                + Thêm Hoạt động Ngoại khóa / Dự án / Thực tập mới
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                <input
                  type="text"
                  placeholder="Tên hoạt động / Dự án / CLB *"
                  value={newExtra.title}
                  onChange={(e) =>
                    setNewExtra({ ...newExtra, title: e.target.value })
                  }
                  className="px-3 py-2 rounded-lg border border-slate-300 bg-white"
                />
                <input
                  type="text"
                  placeholder="Vai trò (VD: Founder / Chủ tịch) *"
                  value={newExtra.role}
                  onChange={(e) =>
                    setNewExtra({ ...newExtra, role: e.target.value })
                  }
                  className="px-3 py-2 rounded-lg border border-slate-300 bg-white"
                />
                <input
                  type="text"
                  placeholder="Tổ chức / Đơn vị"
                  value={newExtra.organization}
                  onChange={(e) =>
                    setNewExtra({ ...newExtra, organization: e.target.value })
                  }
                  className="px-3 py-2 rounded-lg border border-slate-300 bg-white"
                />
                <input
                  type="text"
                  placeholder="Thời gian (VD: 2025 - Hiện tại)"
                  value={newExtra.duration}
                  onChange={(e) =>
                    setNewExtra({ ...newExtra, duration: e.target.value })
                  }
                  className="px-3 py-2 rounded-lg border border-slate-300 bg-white"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <textarea
                  rows={2}
                  placeholder="Mô tả đóng góp & con số tác động thực tế (Impact)..."
                  value={newExtra.description}
                  onChange={(e) =>
                    setNewExtra({ ...newExtra, description: e.target.value })
                  }
                  className="sm:col-span-2 px-3 py-2 rounded-lg border border-slate-300 bg-white"
                />
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Link Google Drive minh chứng (nếu có)"
                    value={newExtra.proofUrl}
                    onChange={(e) =>
                      setNewExtra({ ...newExtra, proofUrl: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newExtra.title || !newExtra.role) return;
                      postRecord("extracurricular", "create", newExtra);
                      setNewExtra({
                        title: "",
                        organization: "",
                        role: "",
                        category: "Lãnh đạo & Cộng đồng",
                        duration: "",
                        description: "",
                        proofUrl: "",
                      });
                    }}
                    className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                  >
                    + Lưu Hoạt động Ngoại khóa
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 3. GIẢI THƯỞNG & THÀNH TÍCH (AWARDS & HONORS) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
              <Award className="w-5 h-5 text-amber-500" />
              <span>
                3. Giải thưởng & Thành tích Nổi bật ({student.awards.length})
              </span>
            </div>

            <div className="space-y-2.5">
              {student.awards.map((aw: any) => (
                <div
                  key={aw.id}
                  className="p-3.5 rounded-xl border border-amber-200/80 bg-amber-50/40 flex items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px] uppercase">
                        Cấp {aw.level}
                      </span>
                      <span className="font-bold text-sm text-slate-900">
                        {aw.title}
                      </span>
                      <span className="text-slate-500">({aw.year})</span>
                    </div>
                    <div className="text-slate-600">
                      Đơn vị cấp: <strong>{aw.issuer}</strong>
                      {aw.description && ` — ${aw.description}`}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => postRecord("award", "delete", { id: aw.id })}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Form thêm giải thưởng */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-2 border-t border-slate-100 text-xs">
              <input
                type="text"
                placeholder="Tên giải thưởng / Huy chương *"
                value={newAward.title}
                onChange={(e) =>
                  setNewAward({ ...newAward, title: e.target.value })
                }
                className="sm:col-span-2 px-3 py-2 rounded-xl border border-slate-300"
              />
              <select
                value={newAward.level}
                onChange={(e) =>
                  setNewAward({ ...newAward, level: e.target.value })
                }
                className="px-3 py-2 rounded-xl border border-slate-300 bg-white"
              >
                <option value="Quốc tế">Cấp Quốc tế</option>
                <option value="Quốc gia">Cấp Quốc gia</option>
                <option value="Tỉnh/Thành phố">Cấp Tỉnh / Thành phố</option>
                <option value="Trường">Cấp Trường</option>
              </select>
              <input
                type="text"
                placeholder="Đơn vị trao giải & Năm"
                value={newAward.issuer}
                onChange={(e) =>
                  setNewAward({ ...newAward, issuer: e.target.value })
                }
                className="px-3 py-2 rounded-xl border border-slate-300"
              />
              <button
                type="button"
                onClick={() => {
                  if (!newAward.title) return;
                  postRecord("award", "create", newAward);
                  setNewAward({ ...newAward, title: "", issuer: "" });
                }}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold"
              >
                + Thêm Giải thưởng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: HỒ SƠ TÀI CHÍNH GIA ĐÌNH & HỌC BỔNG */}
      {activeTab === "financial" && (
        <form
          onSubmit={handleSaveProfile}
          className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-base font-bold text-slate-900">
              <Wallet className="w-5 h-5 text-emerald-600" />
              <span>
                Hồ sơ Tài chính Gia đình Học sinh (Phục vụ Xin Học bổng / Financial Aid & Chứng minh Tài chính Visa)
              </span>
            </div>
            <button
              type="submit"
              disabled={savingProfile}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
            >
              {savingProfile ? "Đang lưu..." : "Lưu Hồ sơ Tài chính"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-3">
              <div>
                <label className="block font-bold text-emerald-950 mb-1">
                  1. Khả năng Chi trả / Ngân sách Gia đình mỗi năm (Annual Family Budget)
                </label>
                <input
                  type="text"
                  value={profileForm.annualBudget}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      annualBudget: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-emerald-300 bg-white font-bold text-sm text-emerald-900"
                />
              </div>

              <div>
                <label className="block font-bold text-emerald-950 mb-1">
                  2. Mức Học bổng / Hỗ trợ Tài chính kỳ vọng (Scholarship & Financial Aid Target)
                </label>
                <input
                  type="text"
                  value={profileForm.scholarshipTarget}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      scholarshipTarget: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-emerald-300 bg-white font-semibold"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  3. Sổ tiết kiệm Chứng minh Tài chính (Bank Balance / Savings / GIC / Sperrkonto)
                </label>
                <input
                  type="text"
                  value={profileForm.savingsAmount}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      savingsAmount: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  4. Nguồn Thu nhập Thường xuyên của Bố Mẹ & Hồ sơ Thuế
                </label>
                <textarea
                  rows={2}
                  value={profileForm.parentsIncome}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      parentsIncome: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-slate-800 mb-1">
                5. Tài sản Đảm bảo Khác (Bất động sản, Cổ phần Doanh nghiệp, Hợp đồng cho thuê...)
              </label>
              <textarea
                rows={2}
                value={profileForm.assetsInfo}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, assetsInfo: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
              />
            </div>
          </div>
        </form>
      )}

      {/* TAB 4: DANH SÁCH TRƯỜNG MỤC TIÊU & NGUYỆN VỌNG (REACH / MATCH / SAFETY) */}
      {activeTab === "applications" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-base font-bold text-slate-900">
                <Building2 className="w-5 h-5 text-blue-600" />
                <span>
                  Danh sách Trường Mục tiêu & Nguyện vọng Nộp đơn (Reach / Match / Safety)
                </span>
              </div>
            </div>

            {/* Bảng nguyện vọng */}
            <div className="space-y-3">
              {student.applications.map((app: any) => {
                const catMeta =
                  APP_CATEGORY_LABELS[app.category] ||
                  APP_CATEGORY_LABELS.MATCH;
                return (
                  <div
                    key={app.id}
                    className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 transition flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] border ${catMeta.badge}`}
                        >
                          {catMeta.label}
                        </span>
                        <span className="font-bold text-base text-slate-900">
                          {app.school?.name}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                          {app.school?.country}
                        </span>
                        {app.school?.ranking && (
                          <span className="text-slate-500">
                            ({app.school.ranking})
                          </span>
                        )}
                      </div>
                      <div className="text-slate-700 font-medium">
                        Chuyên ngành: <strong>{app.major}</strong> ({app.degreeLevel} • Kỳ {app.intake})
                      </div>
                      <div className="text-slate-500 flex flex-wrap gap-3">
                        {app.deadline && (
                          <span>
                            Hạn nộp (Deadline):{" "}
                            <strong className="text-rose-600">
                              {app.deadline}
                            </strong>
                          </span>
                        )}
                        {app.scholarshipResult && (
                          <span>
                            Kết quả Học bổng / Offer:{" "}
                            <strong className="text-emerald-700">
                              {app.scholarshipResult}
                            </strong>
                          </span>
                        )}
                      </div>
                      {app.notes && (
                        <div className="text-slate-500 italic">
                          Ghi chú: {app.notes}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <select
                        value={app.status}
                        onChange={(e) =>
                          postRecord("application", "update", {
                            id: app.id,
                            status: e.target.value,
                            category: app.category,
                            scholarshipResult: app.scholarshipResult,
                            notes: app.notes,
                          })
                        }
                        className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white font-semibold text-xs"
                      >
                        <option value="PREPARING">Đang chuẩn bị đơn</option>
                        <option value="SUBMITTED">Đã nộp trường (Submitted)</option>
                        <option value="OFFER_RECEIVED">Đã nhận Offer / Học bổng</option>
                        <option value="VISA_PROCESSING">Đang làm Visa trường này</option>
                        <option value="COMPLETED">Nhập học chính thức</option>
                        <option value="REJECTED">Từ chối / Không nhập học</option>
                      </select>

                      <button
                        type="button"
                        onClick={() =>
                          postRecord("application", "delete", { id: app.id })
                        }
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Form thêm nguyện vọng trường (Chọn từ danh mục HOẶC gõ trường mới trực tiếp) */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">
                  + Thêm Trường Mục tiêu / Nguyện vọng Nộp đơn
                </span>
                <button
                  type="button"
                  onClick={() => setUseNewSchoolInput(!useNewSchoolInput)}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  {useNewSchoolInput
                    ? "← Chọn từ Danh mục Trường có sẵn"
                    : "+ Trường chưa có trong danh mục? Bấm để gõ tên trường mới ngay tại đây"}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                {!useNewSchoolInput ? (
                  <select
                    value={newApp.schoolId}
                    onChange={(e) =>
                      setNewApp({ ...newApp, schoolId: e.target.value })
                    }
                    className="sm:col-span-2 px-3 py-2 rounded-lg border border-slate-300 bg-white font-semibold"
                  >
                    {allSchools.map((sch) => (
                      <option key={sch.id} value={sch.id}>
                        [{sch.country}] {sch.name} ({sch.ranking})
                      </option>
                    ))}
                  </select>
                ) : (
                  <>
                    <input
                      type="text"
                      placeholder="Nhập tên Trường mới (VD: Cornell University) *"
                      value={newApp.newSchoolName}
                      onChange={(e) =>
                        setNewApp({ ...newApp, newSchoolName: e.target.value })
                      }
                      className="px-3 py-2 rounded-lg border border-blue-400 bg-white"
                    />
                    <select
                      value={newApp.newSchoolCountry}
                      onChange={(e) =>
                        setNewApp({
                          ...newApp,
                          newSchoolCountry: e.target.value,
                        })
                      }
                      className="px-3 py-2 rounded-lg border border-blue-400 bg-white"
                    >
                      {COUNTRIES_LIST.map((c) => (
                        <option key={c} value={c}>
                          Quốc gia: {c}
                        </option>
                      ))}
                    </select>
                  </>
                )}

                <select
                  value={newApp.category}
                  onChange={(e) =>
                    setNewApp({ ...newApp, category: e.target.value })
                  }
                  className="px-3 py-2 rounded-lg border border-slate-300 bg-white font-semibold"
                >
                  <option value="REACH">Phân loại: Reach (Mơ ước)</option>
                  <option value="MATCH">Phân loại: Match (Vừa sức)</option>
                  <option value="SAFETY">Phân loại: Safety (An toàn)</option>
                </select>

                <input
                  type="date"
                  value={newApp.deadline}
                  onChange={(e) =>
                    setNewApp({ ...newApp, deadline: e.target.value })
                  }
                  className="px-3 py-2 rounded-lg border border-slate-300 bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <input
                  type="text"
                  placeholder="Chuyên ngành đăng ký (VD: B.S. Computer Science) *"
                  value={newApp.major}
                  onChange={(e) =>
                    setNewApp({ ...newApp, major: e.target.value })
                  }
                  className="px-3 py-2 rounded-lg border border-slate-300 bg-white"
                />
                <input
                  type="text"
                  placeholder="Mục tiêu / Kết quả Học bổng (VD: Học bổng $20,000/năm)"
                  value={newApp.scholarshipResult}
                  onChange={(e) =>
                    setNewApp({ ...newApp, scholarshipResult: e.target.value })
                  }
                  className="px-3 py-2 rounded-lg border border-slate-300 bg-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!newApp.major) return;
                    postRecord("application", "create", {
                      ...newApp,
                      schoolId: useNewSchoolInput ? "" : newApp.schoolId,
                    });
                  }}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  + Thêm vào Danh sách Nguyện vọng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: BÀI LUẬN (ESSAYS), THƯ GIỚI THIỆU (LOR) & LỘ TRÌNH HOÀN THIỆN HỒ SƠ */}
      {activeTab === "essays" && (
        <div className="space-y-6">
          {/* 1. Quản lý Bài luận (Personal Statement / SOP / Supplemental) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
              <FileEdit className="w-5 h-5 text-blue-600" />
              <span>
                1. Quản lý Bài luận Du học & Học bổng (Personal Statement / SOP / Supplemental Essays)
              </span>
            </div>

            <div className="space-y-3">
              {student.essays.map((es: any) => {
                const stMeta =
                  ESSAY_STATUS_LABELS[es.status] ||
                  ESSAY_STATUS_LABELS.DRAFTING;
                return (
                  <div
                    key={es.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] border ${stMeta.badge}`}
                        >
                          {stMeta.label}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-semibold text-[11px]">
                          {es.essayType} ({es.wordCountTarget} từ)
                        </span>
                        <span className="text-slate-500 font-medium">
                          Trường: <strong>{es.targetSchool}</strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={es.status}
                          onChange={(e) =>
                            postRecord("essay", "update", {
                              ...es,
                              status: e.target.value,
                            })
                          }
                          className="px-2.5 py-1 rounded-lg border border-slate-300 bg-white font-semibold"
                        >
                          <option value="IDEA">Lên ý tưởng</option>
                          <option value="DRAFTING">Đang viết nháp</option>
                          <option value="REVIEWING">Cố vấn đang sửa</option>
                          <option value="FINAL">Đã chốt Final</option>
                        </select>
                        <button
                          type="button"
                          onClick={() =>
                            postRecord("essay", "delete", { id: es.id })
                          }
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="font-bold text-sm text-slate-900">
                      {es.title}
                    </div>

                    {es.feedback && (
                      <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-950">
                        <strong>Nhận xét của cố vấn:</strong> {es.feedback}
                      </div>
                    )}

                    <div className="flex items-center gap-4 pt-1 flex-wrap">
                      {es.externalUrl && (
                        <a
                          href={es.externalUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 font-semibold hover:underline inline-flex items-center gap-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Mở Google Docs Bài luận</span>
                        </a>
                      )}
                      {es.fileUrl && (
                        <a
                          href={es.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-700 font-semibold hover:underline inline-flex items-center gap-1"
                        >
                          <FileCheck2 className="w-3.5 h-3.5" />
                          <span>File đính kèm: {es.fileName || "Xem file"}</span>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Form thêm bài luận mới */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <div className="font-bold text-slate-800">
                + Thêm Chủ đề Bài luận Mới (Hỗ trợ gắn Link Google Docs và/hoặc Tải file Word/PDF)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                <input
                  type="text"
                  placeholder="Chủ đề / Đề bài luận (Prompt) *"
                  value={newEssay.title}
                  onChange={(e) =>
                    setNewEssay({ ...newEssay, title: e.target.value })
                  }
                  className="sm:col-span-2 px-3 py-2 rounded-lg border border-slate-300 bg-white"
                />
                <select
                  value={newEssay.essayType}
                  onChange={(e) =>
                    setNewEssay({ ...newEssay, essayType: e.target.value })
                  }
                  className="px-3 py-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="Personal Statement">Personal Statement</option>
                  <option value="Supplemental Essay">Supplemental Essay</option>
                  <option value="Statement of Purpose">Statement of Purpose (SOP)</option>
                  <option value="Study Plan / GSR">Study Plan / GSR</option>
                </select>
                <input
                  type="text"
                  placeholder="Trường áp dụng (VD: NYU / Common App)"
                  value={newEssay.targetSchool}
                  onChange={(e) =>
                    setNewEssay({ ...newEssay, targetSchool: e.target.value })
                  }
                  className="px-3 py-2 rounded-lg border border-slate-300 bg-white"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <input
                  type="text"
                  placeholder="Link Google Docs bản thảo..."
                  value={newEssay.externalUrl}
                  onChange={(e) =>
                    setNewEssay({ ...newEssay, externalUrl: e.target.value })
                  }
                  className="px-3 py-2 rounded-lg border border-slate-300 bg-white"
                />
                <input
                  type="text"
                  placeholder="Nhận xét / Ghi chú của Cố vấn..."
                  value={newEssay.feedback}
                  onChange={(e) =>
                    setNewEssay({ ...newEssay, feedback: e.target.value })
                  }
                  className="px-3 py-2 rounded-lg border border-slate-300 bg-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!newEssay.title) return;
                    postRecord("essay", "create", newEssay);
                    setNewEssay({
                      ...newEssay,
                      title: "",
                      externalUrl: "",
                      feedback: "",
                    });
                  }}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  + Thêm Bài luận
                </button>
              </div>
            </div>
          </div>

          {/* 2. Thư giới thiệu (LOR) & 3. Lộ trình công việc (Roadmap Tasks) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Thư giới thiệu */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-slate-900 pb-2 border-b border-slate-100">
                2. Thư Giới Thiệu — Recommendation Letters ({student.recommendations.length})
              </h3>
              <div className="space-y-2.5">
                {student.recommendations.map((lor: any) => (
                  <div
                    key={lor.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">
                        {lor.recommenderName}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px]">
                          {lor.status}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            postRecord("recommendation", "delete", {
                              id: lor.id,
                            })
                          }
                          className="text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="text-slate-600">{lor.recommenderTitle}</div>
                    <div className="text-slate-500">
                      Quan hệ: {lor.relationship} • Email: {lor.recommenderEmail}
                    </div>
                    {lor.externalUrl && (
                      <a
                        href={lor.externalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 font-semibold hover:underline inline-flex items-center gap-1 pt-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Xem bản thảo / File LOR đã ký</span>
                      </a>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Họ tên Người giới thiệu *"
                    value={newLor.recommenderName}
                    onChange={(e) =>
                      setNewLor({ ...newLor, recommenderName: e.target.value })
                    }
                    className="px-3 py-2 rounded-lg border border-slate-300"
                  />
                  <input
                    type="text"
                    placeholder="Chức danh / Giáo viên môn..."
                    value={newLor.recommenderTitle}
                    onChange={(e) =>
                      setNewLor({ ...newLor, recommenderTitle: e.target.value })
                    }
                    className="px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Link Google Drive / Docs LOR"
                    value={newLor.externalUrl}
                    onChange={(e) =>
                      setNewLor({ ...newLor, externalUrl: e.target.value })
                    }
                    className="px-3 py-2 rounded-lg border border-slate-300"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newLor.recommenderName) return;
                      postRecord("recommendation", "create", newLor);
                      setNewLor({
                        ...newLor,
                        recommenderName: "",
                        recommenderTitle: "",
                        externalUrl: "",
                      });
                    }}
                    className="px-3 py-2 rounded-lg bg-slate-900 text-white font-semibold"
                  >
                    + Thêm Người giới thiệu
                  </button>
                </div>
              </div>
            </div>

            {/* Lộ trình hoàn thiện hồ sơ (Roadmap Tasks) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-slate-900 pb-2 border-b border-slate-100">
                3. Lộ Trình Hoàn Thiện Hồ Sơ & Deadline ({student.roadmapTasks.length})
              </h3>
              <div className="space-y-2">
                {student.roadmapTasks.map((t: any) => (
                  <div
                    key={t.id}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                      t.completed
                        ? "bg-slate-50 border-slate-200 opacity-60 line-through"
                        : "bg-white border-slate-200"
                    }`}
                  >
                    <label className="flex items-center gap-2.5 cursor-pointer flex-1">
                      <input
                        type="checkbox"
                        checked={t.completed}
                        onChange={(e) =>
                          postRecord("task", "toggle", {
                            id: t.id,
                            completed: e.target.checked,
                          })
                        }
                        className="rounded text-blue-600"
                      />
                      <div>
                        <div className="font-semibold text-slate-900">
                          {t.title}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Hạn: <strong>{t.dueDate}</strong> • Phụ trách:{" "}
                          {t.assigneeName}
                        </div>
                      </div>
                    </label>
                    <button
                      type="button"
                      onClick={() => postRecord("task", "delete", { id: t.id })}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-xs">
                <input
                  type="text"
                  placeholder="Tên đầu việc cần hoàn thành *"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  className="px-3 py-2 rounded-lg border border-slate-300"
                />
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) =>
                    setNewTask({ ...newTask, dueDate: e.target.value })
                  }
                  className="px-3 py-2 rounded-lg border border-slate-300"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!newTask.title) return;
                    postRecord("task", "create", newTask);
                    setNewTask({ ...newTask, title: "" });
                  }}
                  className="px-3 py-2 rounded-lg bg-blue-600 text-white font-semibold"
                >
                  + Giao Task / Milestone
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: CHECKLIST GIẤY TỜ (TẢI FILE TRỰC TIẾP + GẮN LINK GOOGLE DRIVE + KIỂM DUYỆT) */}
      {activeTab === "documents" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Checklist Giấy Tờ Hồ Sơ Du Học & Tài Chính ({student.documents.length} mục)
              </h3>
              <p className="text-xs text-slate-500">
                Hỗ trợ kết hợp cả 2 phương thức: Tải trực tiếp file (PDF, Ảnh, Word) lên hệ thống VÀ gắn link Google Drive ngoài.
              </p>
            </div>

            {/* Nạp nhanh mẫu Checklist theo quốc gia */}
            <div className="flex items-center gap-2">
              <select
                value={templateCountryToLoad}
                onChange={(e) => setTemplateCountryToLoad(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white"
              >
                {COUNTRIES_LIST.map((c) => (
                  <option key={c} value={c}>
                    Mẫu chuẩn: {c}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() =>
                  postRecord("document", "load_template", {
                    country: templateCountryToLoad,
                  })
                }
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-semibold transition"
              >
                + Nạp Mẫu Checklist Quốc gia
              </button>
            </div>
          </div>

          {/* Danh sách từng đầu mục giấy tờ */}
          <div className="space-y-3">
            {student.documents.map((doc: any) => {
              const stMeta =
                DOC_STATUS_LABELS[doc.status] || DOC_STATUS_LABELS.MISSING;
              return (
                <div
                  key={doc.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-blue-200 transition flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] border ${stMeta.badge}`}
                      >
                        {stMeta.label}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[11px]">
                        {doc.category}
                      </span>
                      {doc.country && (
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold text-[11px]">
                          {doc.country}
                        </span>
                      )}
                      <span className="font-bold text-sm text-slate-900">
                        {doc.name}
                      </span>
                    </div>

                    {/* Links file đã tải lên hoặc Google Drive */}
                    <div className="flex items-center gap-4 flex-wrap pt-0.5">
                      {doc.fileUrl ? (
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-emerald-700 font-semibold hover:underline bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200"
                        >
                          <FileCheck2 className="w-3.5 h-3.5" />
                          <span>File hệ thống: {doc.fileName || "Xem file"}</span>
                        </a>
                      ) : (
                        <span className="text-slate-400">
                          Chưa tải file trực tiếp
                        </span>
                      )}

                      {doc.externalUrl && (
                        <a
                          href={doc.externalUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 font-semibold hover:underline bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Mở Link Google Drive</span>
                        </a>
                      )}
                    </div>

                    {doc.reviewerNote && (
                      <div className="text-slate-600 italic">
                        Ghi chú kiểm duyệt: <strong>{doc.reviewerNote}</strong>
                      </div>
                    )}
                  </div>

                  {/* Hành động: Upload file trực tiếp, Gắn link Drive, Đổi trạng thái duyệt */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {/* Nút chọn file tải trực tiếp lên cho mục giấy tờ này */}
                    <label className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold cursor-pointer inline-flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5 text-blue-600" />
                      <span>{uploadingFile ? "Đang tải..." : "Tải file lên"}</span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (!f) return;
                          handleFileUpload(f, (fileUrl, fileName) => {
                            postRecord("document", "update", {
                              ...doc,
                              fileUrl,
                              fileName,
                              status:
                                doc.status === "MISSING"
                                  ? "PENDING_REVIEW"
                                  : doc.status,
                            });
                          });
                        }}
                      />
                    </label>

                    {/* Chuyển trạng thái kiểm duyệt */}
                    <select
                      value={doc.status}
                      onChange={(e) =>
                        postRecord("document", "update", {
                          ...doc,
                          status: e.target.value,
                        })
                      }
                      className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white font-semibold"
                    >
                      <option value="MISSING">Chưa nộp</option>
                      <option value="PENDING_REVIEW">Chờ kiểm duyệt</option>
                      <option value="APPROVED">Hợp lệ (Đã duyệt)</option>
                      <option value="NEEDS_REVISION">Cần bổ sung / Sửa</option>
                    </select>

                    <button
                      type="button"
                      onClick={() =>
                        postRecord("document", "delete", { id: doc.id })
                      }
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Form thêm mục giấy tờ mới kèm tải file & link Google Drive */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
            <div className="font-bold text-slate-800">
              + Thêm Mục Giấy Tờ / Tài Liệu Mới (Tải file trực tiếp và/hoặc Dán link Google Drive)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
              <input
                type="text"
                placeholder="Tên giấy tờ (VD: Sổ tiết kiệm / Học bạ) *"
                value={newDoc.name}
                onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })}
                className="sm:col-span-2 px-3 py-2 rounded-lg border border-slate-300 bg-white"
              />
              <select
                value={newDoc.category}
                onChange={(e) =>
                  setNewDoc({ ...newDoc, category: e.target.value })
                }
                className="px-3 py-2 rounded-lg border border-slate-300 bg-white"
              >
                <option value="Cá nhân">Nhóm: Cá nhân & Định danh</option>
                <option value="Học thuật">Nhóm: Học thuật & Bằng cấp</option>
                <option value="Ngoại khóa & Giải thưởng">
                  Nhóm: Chứng nhận Ngoại khóa & Giải thưởng
                </option>
                <option value="Tài chính">Nhóm: Hồ sơ Tài chính</option>
                <option value="Visa">Nhóm: Hồ sơ Visa & Lãnh sự</option>
              </select>
              <input
                type="text"
                placeholder="Quốc gia (VD: Mỹ)"
                value={newDoc.country}
                onChange={(e) =>
                  setNewDoc({ ...newDoc, country: e.target.value })
                }
                className="px-3 py-2 rounded-lg border border-slate-300 bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 items-center">
              <input
                type="text"
                placeholder="Link Google Drive / OneDrive (nếu có)..."
                value={newDoc.externalUrl}
                onChange={(e) =>
                  setNewDoc({ ...newDoc, externalUrl: e.target.value })
                }
                className="px-3 py-2 rounded-lg border border-slate-300 bg-white"
              />
              <input
                type="text"
                placeholder="Ghi chú kiểm duyệt..."
                value={newDoc.reviewerNote}
                onChange={(e) =>
                  setNewDoc({ ...newDoc, reviewerNote: e.target.value })
                }
                className="px-3 py-2 rounded-lg border border-slate-300 bg-white"
              />
              <label className="px-3 py-2 rounded-lg border border-dashed border-blue-400 bg-blue-50/50 text-blue-700 font-semibold cursor-pointer text-center truncate">
                {newDoc.fileName
                  ? `Đã chọn: ${newDoc.fileName}`
                  : "Chọn File Tải Lên (PDF/Ảnh/Word)"}
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    handleFileUpload(f, (fileUrl, fileName) => {
                      setNewDoc((prev) => ({ ...prev, fileUrl, fileName }));
                    });
                  }}
                />
              </label>
              <button
                type="button"
                onClick={() => {
                  if (!newDoc.name) return;
                  postRecord("document", "create", newDoc);
                  setNewDoc({
                    ...newDoc,
                    name: "",
                    externalUrl: "",
                    fileUrl: "",
                    fileName: "",
                    reviewerNote: "",
                  });
                }}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold"
              >
                + Lưu Giấy tờ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: NHẬT KÝ HOẠT ĐỘNG & GHI CHÚ NỘI BỘ */}
      {activeTab === "notes" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2 text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
            <MessageSquare className="w-5 h-5 text-purple-600" />
            <span>
              Nhật ký Phối hợp & Ghi chú Trao đổi Nội bộ ({student.activityNotes.length})
            </span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              placeholder={`Viết ghi chú trao đổi nội bộ với tư cách ${currentUser.name}...`}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs"
            />
            <button
              type="button"
              onClick={() => {
                if (!newNoteContent.trim()) return;
                postRecord("note", "create", { content: newNoteContent });
                setNewNoteContent("");
              }}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shrink-0"
            >
              Gửi Ghi chú
            </button>
          </div>

          <div className="space-y-3">
            {student.activityNotes.map((note: any) => (
              <div
                key={note.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">
                      {note.authorName}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px] font-semibold">
                      {ROLE_LABELS[note.authorRole]?.label || note.authorRole}
                    </span>
                  </div>
                  <span className="text-slate-400 text-[11px] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(note.createdAt).toLocaleString("vi-VN")}
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed pt-1">
                  {note.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
