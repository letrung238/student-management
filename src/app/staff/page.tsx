"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, UserPlus, LogIn } from "lucide-react";
import { ROLE_LABELS } from "@/lib/constants";

export default function StaffPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "COUNSELOR",
    title: "Chuyên viên Tư vấn Du học",
    phone: "",
  });
  const [errorMsg, setErrorMsg] = useState("");

  const loadUsers = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data.users || []);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setErrorMsg(data.error || "Không thể thêm nhân viên");
      return;
    }
    setForm({
      name: "",
      email: "",
      role: "COUNSELOR",
      title: "Chuyên viên Tư vấn Du học",
      phone: "",
    });
    loadUsers();
    router.refresh();
  };

  const handleSwitchToUser = async (userId: string) => {
    await fetch("/api/auth/switch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    router.push("/");
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          Quản lý Nhân sự Nội bộ & Phân quyền 3 Vai trò (RBAC)
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Mô hình bảo mật: Nhân viên (Tư vấn viên & Xử lý hồ sơ) chỉ xem và chỉnh sửa được hồ sơ học sinh mà mình nằm trong nhóm phụ trách. Admin quản lý toàn bộ.
        </p>
      </div>

      {/* Giải thích 3 vai trò */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(ROLE_LABELS).map(([roleKey, meta]) => (
          <div
            key={roleKey}
            className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${meta.badge}`}
              >
                {meta.label} ({roleKey})
              </span>
              <ShieldCheck className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {meta.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Form thêm nhân sự (Chỉ Admin thực hiện được) */}
      <form
        onSubmit={handleCreateUser}
        className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 text-xs"
      >
        <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-blue-600" />
          <span>Thêm Tài Khoản Nhân Viên Mới (Yêu cầu quyền Admin)</span>
        </div>
        {errorMsg && (
          <div className="p-2.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 font-semibold">
            {errorMsg}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          <input
            type="text"
            required
            placeholder="Họ và tên nhân viên *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="px-3 py-2 rounded-xl border border-slate-300"
          />
          <input
            type="email"
            required
            placeholder="Email công ty *"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="px-3 py-2 rounded-xl border border-slate-300"
          />
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold"
          >
            <option value="COUNSELOR">Vai trò: Tư vấn viên (COUNSELOR)</option>
            <option value="CASE_OFFICER">
              Vai trò: Xử lý hồ sơ (CASE_OFFICER)
            </option>
            <option value="ADMIN">Vai trò: Quản trị viên (ADMIN)</option>
          </select>
          <input
            type="text"
            placeholder="Chức danh chuyên môn"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="px-3 py-2 rounded-xl border border-slate-300"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
          >
            + Tạo Nhân viên
          </button>
        </div>
      </form>

      {/* Danh sách nhân sự & Hồ sơ đang phụ trách */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {users.map((u) => {
          const rMeta = ROLE_LABELS[u.role] || ROLE_LABELS.COUNSELOR;
          return (
            <div
              key={u.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between gap-4 text-xs"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                      style={{ backgroundColor: u.avatarColor }}
                    >
                      {u.name
                        .split(" ")
                        .slice(-2)
                        .map((n: string) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <div className="font-bold text-base text-slate-900">
                        {u.name}
                      </div>
                      <div className="text-slate-500">{u.title}</div>
                      <div className="text-slate-400 text-[11px]">
                        {u.email} {u.phone && `• ${u.phone}`}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] border ${rMeta.badge}`}
                  >
                    {rMeta.label}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <div className="font-semibold text-slate-700 mb-1.5">
                    Hồ sơ học sinh được phân công phụ trách (
                    {u.role === "ADMIN"
                      ? "Toàn quyền mọi hồ sơ"
                      : `${u.assignments?.length || 0} hồ sơ`}
                    ):
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {u.assignments?.map((asg: any) => (
                      <Link
                        key={asg.id}
                        href={`/students/${asg.student.id}`}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-800 hover:text-blue-700 font-medium border border-slate-200"
                      >
                        {asg.student.code} — {asg.student.fullName}
                      </Link>
                    ))}
                    {u.role === "ADMIN" && (
                      <span className="text-slate-500 italic">
                        Admin có quyền xem và điều phối tất cả hồ sơ trong hệ thống.
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleSwitchToUser(u.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-semibold inline-flex items-center gap-1.5 transition"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Đăng nhập thử với vai trò của {u.name}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
