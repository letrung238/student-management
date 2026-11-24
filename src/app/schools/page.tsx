"use client";

import React, { useState, useEffect } from "react";
import { Building2, Plus, Trash2, Globe2, ExternalLink } from "lucide-react";
import { COUNTRIES_LIST } from "@/lib/constants";

export default function SchoolsPage() {
  const [schools, setSchools] = useState<any[]>([]);
  const [countryFilter, setCountryFilter] = useState("ALL");
  const [form, setForm] = useState({
    name: "",
    country: "Mỹ",
    city: "",
    ranking: "",
    tuitionRange: "",
    defaultRequirements: "",
    website: "",
  });

  const loadSchools = async () => {
    const res = await fetch("/api/schools");
    const data = await res.json();
    setSchools(data.schools || []);
  };

  useEffect(() => {
    loadSchools();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    await fetch("/api/schools", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({
      name: "",
      country: "Mỹ",
      city: "",
      ranking: "",
      tuitionRange: "",
      defaultRequirements: "",
      website: "",
    });
    loadSchools();
  };

  const handleDelete = async (id: string) => {
    await fetch("/api/schools", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id }),
    });
    loadSchools();
  };

  const filtered = schools.filter(
    (s) => countryFilter === "ALL" || s.country === countryFilter
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Danh mục Trường Đối tác & Đại học Quốc tế
          </h2>
          <p className="text-sm text-slate-500">
            Cơ sở dữ liệu trường dùng chung để Tư vấn viên chọn nhanh khi lên danh sách trường Reach / Match / Safety cho học sinh.
          </p>
        </div>

        <select
          value={countryFilter}
          onChange={(e) => setCountryFilter(e.target.value)}
          className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
        >
          <option value="ALL">Tất cả Quốc gia ({schools.length} trường)</option>
          {COUNTRIES_LIST.map((c) => (
            <option key={c} value={c}>
              Trường tại {c}
            </option>
          ))}
        </select>
      </div>

      {/* Form thêm trường mới */}
      <form
        onSubmit={handleAdd}
        className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 text-xs"
      >
        <div className="font-bold text-slate-900 flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4 text-blue-600" />
          <span>Thêm Trường Mới vào Danh Mục Chung</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input
            type="text"
            required
            placeholder="Tên trường Đại học / Cao đẳng / THPT *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="sm:col-span-2 px-3 py-2 rounded-xl border border-slate-300"
          />
          <select
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
            className="px-3 py-2 rounded-xl border border-slate-300 bg-white"
          >
            {COUNTRIES_LIST.map((c) => (
              <option key={c} value={c}>
                Quốc gia: {c}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Thành phố / Bang (VD: Boston, MA)"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            className="px-3 py-2 rounded-xl border border-slate-300"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Xếp hạng (VD: #25 US News / #18 QS)"
            value={form.ranking}
            onChange={(e) => setForm({ ...form, ranking: e.target.value })}
            className="px-3 py-2 rounded-xl border border-slate-300"
          />
          <input
            type="text"
            placeholder="Học phí tham khảo (VD: $45,000/năm)"
            value={form.tuitionRange}
            onChange={(e) => setForm({ ...form, tuitionRange: e.target.value })}
            className="px-3 py-2 rounded-xl border border-slate-300"
          />
          <input
            type="text"
            placeholder="Điều kiện đầu vào tiêu chuẩn (GPA, IELTS, SAT...)"
            value={form.defaultRequirements}
            onChange={(e) =>
              setForm({ ...form, defaultRequirements: e.target.value })
            }
            className="px-3 py-2 rounded-xl border border-slate-300"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
          >
            + Lưu Trường vào Danh mục
          </button>
        </div>
      </form>

      {/* Danh sách trường */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((sch) => (
          <div
            key={sch.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between gap-3 text-xs"
          >
            <div className="space-y-1.5">
              <div className="flex items-start justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold text-[11px] inline-flex items-center gap-1">
                  <Globe2 className="w-3 h-3" />
                  {sch.country} {sch.city && `• ${sch.city}`}
                </span>
                <button
                  type="button"
                  onClick={() => handleDelete(sch.id)}
                  className="text-slate-400 hover:text-rose-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-1.5 pt-1">
                <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{sch.name}</span>
              </h3>
              {sch.ranking && (
                <div className="text-amber-700 font-semibold">
                  Xếp hạng: {sch.ranking}
                </div>
              )}
              {sch.tuitionRange && (
                <div className="text-slate-700">
                  Học phí: <strong>{sch.tuitionRange}</strong>
                </div>
              )}
              {sch.defaultRequirements && (
                <div className="text-slate-500 pt-1">
                  Yêu cầu: {sch.defaultRequirements}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="font-semibold text-slate-600">
                Đang có{" "}
                <strong className="text-blue-600">
                  {sch._count?.applications || 0}
                </strong>{" "}
                nguyện vọng học sinh
              </span>
              {sch.website && (
                <a
                  href={sch.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline inline-flex items-center gap-1 font-medium"
                >
                  <span>Website</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
