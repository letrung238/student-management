export const PIPELINE_STAGES = [
  {
    id: "PREPARING",
    label: "1. Đang chuẩn bị hồ sơ",
    shortLabel: "Đang chuẩn bị hồ sơ",
    description: "Xây dựng năng lực, ngoại khóa, bài luận, LOR & gom giấy tờ",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
    dotClass: "bg-amber-500",
    headerClass: "border-amber-400 bg-amber-50/60",
  },
  {
    id: "SUBMITTED",
    label: "2. Đã nộp trường",
    shortLabel: "Đã nộp trường",
    description: "Đã nộp hồ sơ xin thư mời (Offer) & xét Học bổng",
    badgeClass: "bg-blue-50 text-blue-800 border-blue-200",
    dotClass: "bg-blue-500",
    headerClass: "border-blue-400 bg-blue-50/60",
  },
  {
    id: "VISA_PROCESSING",
    label: "3. Đang làm Visa",
    shortLabel: "Đang làm Visa",
    description: "Chứng minh tài chính, đóng cọc học phí, khám sức khỏe & phỏng vấn Visa",
    badgeClass: "bg-purple-50 text-purple-800 border-purple-200",
    dotClass: "bg-purple-500",
    headerClass: "border-purple-400 bg-purple-50/60",
  },
  {
    id: "COMPLETED",
    label: "4. Đã có Visa / Hoàn tất",
    shortLabel: "Đã có Visa / Hoàn tất",
    description: "Đã nhận Visa du học, hướng dẫn trước khi bay & nhập học",
    badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200",
    dotClass: "bg-emerald-500",
    headerClass: "border-emerald-400 bg-emerald-50/60",
  },
] as const;

export const ROLE_LABELS: Record<string, { label: string; badge: string; desc: string }> = {
  ADMIN: {
    label: "Admin Quản trị",
    badge: "bg-blue-100 text-blue-800 border-blue-200",
    desc: "Toàn quyền xem & quản lý mọi hồ sơ, phân công nhân sự, cấu hình danh mục",
  },
  COUNSELOR: {
    label: "Tư vấn viên",
    badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
    desc: "Chỉ truy cập học sinh được phân công; định hướng ngành, trường & học bổng",
  },
  CASE_OFFICER: {
    label: "Xử lý hồ sơ",
    badge: "bg-amber-100 text-amber-800 border-amber-200",
    desc: "Chỉ truy cập học sinh được phân công; duyệt giấy tờ, nộp trường & làm Visa",
  },
};

export const DOC_STATUS_LABELS: Record<string, { label: string; badge: string }> = {
  MISSING: { label: "Chưa nộp", badge: "bg-slate-100 text-slate-700 border-slate-200" },
  PENDING_REVIEW: { label: "Chờ kiểm duyệt", badge: "bg-amber-100 text-amber-800 border-amber-200" },
  APPROVED: { label: "Hợp lệ (Đã duyệt)", badge: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  NEEDS_REVISION: { label: "Cần bổ sung / Sửa", badge: "bg-rose-100 text-rose-800 border-rose-200" },
};

export const ESSAY_STATUS_LABELS: Record<string, { label: string; badge: string }> = {
  IDEA: { label: "Lên ý tưởng (Brainstorm)", badge: "bg-slate-100 text-slate-700 border-slate-200" },
  DRAFTING: { label: "Đang viết nháp (Drafting)", badge: "bg-blue-100 text-blue-800 border-blue-200" },
  REVIEWING: { label: "Cố vấn đang sửa (Reviewing)", badge: "bg-amber-100 text-amber-800 border-amber-200" },
  FINAL: { label: "Bản hoàn thiện (Final)", badge: "bg-emerald-100 text-emerald-800 border-emerald-200" },
};

export const APP_CATEGORY_LABELS: Record<string, { label: string; badge: string }> = {
  REACH: { label: "Reach (Mơ ước / Cạnh tranh cao)", badge: "bg-rose-100 text-rose-800 border-rose-200" },
  MATCH: { label: "Match (Phù hợp năng lực)", badge: "bg-blue-100 text-blue-800 border-blue-200" },
  SAFETY: { label: "Safety (An toàn chắc chắn)", badge: "bg-emerald-100 text-emerald-800 border-emerald-200" },
};

export const COUNTRIES_LIST = [
  "Mỹ",
  "Canada",
  "Úc",
  "Anh",
  "Hàn Quốc",
  "Nhật Bản",
  "Đức",
  "Hà Lan",
  "Phần Lan",
  "Singapore",
  "New Zealand",
];
