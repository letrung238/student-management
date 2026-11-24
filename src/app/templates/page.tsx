"use client";

import React, { useState, useEffect } from "react";
import { FileCheck2, Plus, Trash2 } from "lucide-react";
import { COUNTRIES_LIST } from "@/lib/constants";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("ALL");
  const [form, setForm] = useState({
    country: "Mỹ",
    documentName: "",
    category: "Học thuật",
    description: "",
  });

  const loadTemplates = async () => {
    const res = await fetch("/api/templates");
    const data = await res.json();
    setTemplates(data.templates || []);
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.documentName.trim()) return;
    await fetch("/api/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ ...form, documentName: "", description: "" });
    loadTemplates();
  };

  const handleDelete = async (id: string) => {
    await fetch("/api/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id }),
    });
    loadTemplates();
  };

  const filtered = templates.filter(
    (t) => selectedCountry === "ALL" || t.country === selectedCountry
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Cấu hình Mẫu Checklist Giấy Tờ Theo Quốc Gia
          </h2>
          <p className="text-sm text-slate-500">
            Khi tạo học sinh mới hoặc bấm &ldquo;Nạp mẫu Checklist&rdquo;, hệ thống sẽ tự động sinh danh mục giấy tờ tương ứng theo quốc gia du học.
          </p>
        </div>

        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
        >
          <option value="ALL">Tất cả Quốc gia ({templates.length} mục)</option>
          {COUNTRIES_LIST.map((c) => (
            <option key={c} value={c}>
              Mẫu hồ sơ {c}
            </option>
          ))}
        </select>
      </div>

      {/* Form thêm đầu mục giấy tờ mẫu */}
      <form
        onSubmit={handleAdd}
        className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 text-xs"
      >
        <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Plus className="w-4 h-4 text-blue-600" />
          <span>Thêm Đầu Mục Giấy Tờ Chuẩn Cho Quốc Gia</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          <select
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
            className="px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold"
          >
            {COUNTRIES_LIST.map((c) => (
              <option key={c} value={c}>
                Quốc gia: {c}
              </option>
            ))}
          </select>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="px-3 py-2 rounded-xl border border-slate-300 bg-white"
          >
            <option value="Cá nhân">Nhóm: Cá nhân</option>
            <option value="Học thuật">Nhóm: Học thuật</option>
            <option value="Tài chính">Nhóm: Tài chính</option>
            <option value="Visa">Nhóm: Visa</option>
          </select>
          <input
            type="text"
            required
            placeholder="Tên giấy tờ bắt buộc *"
            value={form.documentName}
            onChange={(e) =>
              setForm({ ...form, documentName: e.target.value })
            }
            className="sm:col-span-2 px-3 py-2 rounded-xl border border-slate-300"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
          >
            + Thêm vào Mẫu
          </button>
        </div>
      </form>

      {/* Danh sách mẫu checklist */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500">
              <th className="py-3 px-4">Quốc gia</th>
              <th className="py-3 px-4">Phân nhóm</th>
              <th className="py-3 px-4">Tên hạng mục giấy tờ</th>
              <th className="py-3 px-4">Hướng dẫn / Yêu cầu</th>
              <th className="py-3 px-4 text-right">Xóa</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/70">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="py-3 px-4 font-bold text-blue-700">
                  {item.country}
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                    {item.category}
                  </span>
                </td>
                <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{item.documentName}</span>
                </td>
                <td className="py-3 px-4 text-slate-500">{item.description}</td>
                <td className="py-3 px-4 text-right">
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
