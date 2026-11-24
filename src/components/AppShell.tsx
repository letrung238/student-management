"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Users,
  Kanban,
  Building2,
  FileCheck2,
  ShieldCheck,
  Search,
  Bell,
  ChevronDown,
  Check,
  Sparkles,
  GraduationCap,
} from "lucide-react";
import { ROLE_LABELS } from "@/lib/constants";

type UserItem = {
  id: string;
  name: string;
  email: string;
  role: string;
  title: string;
  avatarColor: string;
};

export default function AppShell({
  currentUser,
  allUsers,
  children,
}: {
  currentUser: UserItem;
  allUsers: UserItem[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSwitchUser = async (userId: string) => {
    setSwitching(true);
    setDropdownOpen(false);
    await fetch("/api/auth/switch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    setSwitching(false);
    router.refresh();
  };

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (globalSearch.trim()) {
      router.push(`/students?q=${encodeURIComponent(globalSearch.trim())}`);
    } else {
      router.push("/students");
    }
  };

  const mainNav = [
    { href: "/", label: "Trang chủ", icon: Home },
    { href: "/students", label: "Học sinh", icon: Users },
    { href: "/pipeline", label: "Tiến độ 4 bước", icon: Kanban },
  ];

  const workspaceNav = [
    { href: "/schools", label: "Trường đối tác", icon: Building2 },
    { href: "/templates", label: "Mẫu Checklist", icon: FileCheck2 },
    { href: "/staff", label: "Mọi người & Quyền", icon: ShieldCheck },
  ];

  const roleMeta = ROLE_LABELS[currentUser.role] || ROLE_LABELS.COUNSELOR;

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      {/* Top Global Header Bar — Minimalist MentorOS Style */}
      <header className="no-print h-13 bg-white border-b border-gray-200/90 px-4 flex items-center justify-between gap-4 sticky top-0 z-40">
        {/* Left: Brand */}
        <Link href="/" className="flex items-center gap-2 shrink-0 w-48">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <GraduationCap className="w-4 h-4" strokeWidth={2} />
          </div>
          <span className="font-semibold text-[15px] tracking-tight text-gray-900">
            EduPath<span className="text-indigo-600">OS</span>
          </span>
        </Link>

        {/* Center: Clean Pill Search Bar */}
        <form
          onSubmit={handleGlobalSearch}
          className="flex-1 max-w-md mx-auto hidden sm:block"
        >
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Tìm học sinh, trường học, ngành học..."
              className="w-full h-8 pl-9 pr-8 rounded-full bg-gray-100/80 hover:bg-gray-100 focus:bg-white border border-transparent focus:border-indigo-300 text-[13px] text-gray-800 placeholder:text-gray-400 focus:outline-none transition"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-gray-400 border border-gray-200 bg-white px-1.5 rounded">
              /
            </span>
          </div>
        </form>

        {/* Right: Minimal Icons + User Profile Dropdown (Role Switcher) */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/pipeline"
            title="Theo dõi tiến độ"
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-800 transition"
          >
            <Bell className="w-4 h-4" strokeWidth={1.75} />
          </Link>

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              disabled={switching}
              className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full hover:bg-gray-100 transition"
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-white font-semibold text-[11px]"
                style={{ backgroundColor: currentUser.avatarColor }}
              >
                {currentUser.name
                  .split(" ")
                  .slice(-2)
                  .map((n) => n[0])
                  .join("")}
              </div>
              <span className="text-[13px] font-medium text-gray-800 hidden md:inline">
                {currentUser.name}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-72 bg-white rounded-xl shadow-lg border border-gray-200/90 overflow-hidden z-50 py-1">
                <div className="px-3.5 py-2.5 border-b border-gray-100">
                  <div className="text-[13px] font-semibold text-gray-900">
                    {currentUser.name}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5">
                    {currentUser.title}
                  </div>
                  <span
                    className={`inline-block mt-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full border ${roleMeta.badge}`}
                  >
                    {roleMeta.label}
                  </span>
                </div>

                <div className="px-3.5 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  Chuyển nhanh tài khoản (Test 3 vai trò)
                </div>

                <div className="max-h-64 overflow-y-auto">
                  {allUsers.map((u) => {
                    const active = u.id === currentUser.id;
                    const rMeta = ROLE_LABELS[u.role] || ROLE_LABELS.COUNSELOR;
                    return (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => handleSwitchUser(u.id)}
                        className={`w-full px-3.5 py-2 text-left flex items-center justify-between hover:bg-gray-50 transition ${
                          active ? "bg-indigo-50/60" : ""
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-white font-semibold text-[10px] shrink-0"
                            style={{ backgroundColor: u.avatarColor }}
                          >
                            {u.name
                              .split(" ")
                              .slice(-2)
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div className="min-w-0">
                            <div className="text-[12px] font-medium text-gray-900 truncate">
                              {u.name}
                            </div>
                            <div className="text-[11px] text-gray-500 truncate">
                              {rMeta.label}
                            </div>
                          </div>
                        </div>
                        {active && (
                          <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Body: Left Minimal Light Sidebar + Clean Main Content */}
      <div className="flex-1 flex min-h-0">
        {/* Minimal Light Sidebar */}
        <aside className="no-print w-56 bg-[#fafbfc] border-r border-gray-200/80 flex flex-col justify-between shrink-0 py-3 px-2.5 hidden lg:flex">
          <div className="space-y-5">
            {/* Workspace Pill */}
            <div className="px-2 py-1.5 rounded-lg flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-gray-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                EP
              </div>
              <div className="min-w-0">
                <div className="text-[13px] font-semibold text-gray-900 truncate">
                  EduPath Vận Hành
                </div>
                <div className="text-[11px] text-gray-500 truncate">
                  {roleMeta.label}
                </div>
              </div>
            </div>

            {/* Primary Nav */}
            <nav className="space-y-0.5">
              {mainNav.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[13px] transition ${
                      isActive
                        ? "bg-indigo-50 text-indigo-700 font-medium"
                        : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-900 font-normal"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? "text-indigo-600" : "text-gray-400"
                      }`}
                      strokeWidth={1.75}
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Divider & Secondary Nav */}
            <div className="pt-3 border-t border-gray-200/70 space-y-0.5">
              <div className="px-2.5 pb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                Danh mục & Hệ thống
              </div>
              {workspaceNav.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[13px] transition ${
                      isActive
                        ? "bg-indigo-50 text-indigo-700 font-medium"
                        : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-900 font-normal"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? "text-indigo-600" : "text-gray-400"
                      }`}
                      strokeWidth={1.75}
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Subtle Access Scope Footer */}
          <div className="px-2.5 pt-3 border-t border-gray-200/70 text-[11px] text-gray-400 space-y-1">
            <div className="flex items-center gap-1.5 text-gray-500 font-medium">
              <Sparkles className="w-3 h-3 text-indigo-500" />
              <span>
                {currentUser.role === "ADMIN"
                  ? "Phạm vi: Toàn hệ thống"
                  : "Phạm vi: HS phụ trách"}
              </span>
            </div>
            <div>EduPath Portal v1.0</div>
          </div>
        </aside>

        {/* Main Workspace Canvas */}
        <main className="flex-1 min-w-0 bg-white">
          <div className="max-w-[1440px] mx-auto px-6 py-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
