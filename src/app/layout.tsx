import type { Metadata } from "next";
import "./globals.css";
import { getCurrentUser, getAllUsers } from "@/lib/auth";
import AppShell from "@/components/AppShell";

export const metadata: Metadata = {
  title: "EduPath Global — Web Portal Quản lý Hồ sơ Học sinh Du học",
  description:
    "Hệ thống nội bộ quản lý thông tin hồ sơ học sinh du học, học thuật, ngoại khóa, giải thưởng, tài chính, bài luận, nguyện vọng trường và tiến độ Visa.",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();
  const allUsers = await getAllUsers();

  if (!currentUser) {
    return (
      <html lang="vi">
        <body className="p-8">Đang khởi tạo dữ liệu người dùng...</body>
      </html>
    );
  }

  return (
    <html lang="vi">
      <body className="antialiased">
        <AppShell currentUser={currentUser} allUsers={allUsers}>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
