# EduPathOS — Web Portal Quản lý Hồ sơ Học sinh Du học

Hệ thống Web Portal nội bộ quản lý toàn diện hồ sơ học sinh du học đa quốc gia (Next.js App Router + TypeScript + Tailwind CSS + Prisma + SQLite).

## Tính năng chính
- **Phân quyền 3 vai trò nội bộ (RBAC):** Admin Quản trị, Tư vấn viên (`COUNSELOR`), Xử lý hồ sơ (`CASE_OFFICER`) theo mô hình nhóm nhân viên phụ trách linh hoạt.
- **Dashboard & Tiến độ 4 bước:** `Đang chuẩn bị hồ sơ` → `Đã nộp trường` → `Đang làm Visa` → `Đã có Visa / Hoàn tất`.
- **Danh sách học sinh:** Chế độ phân nhóm thu gọn được (MentorOS style), chế độ bảng chi tiết, bộ lọc nâng cao (Quốc gia, Kỳ nhập học, GPA, Nhân viên phụ trách) và Bảng Kanban 4 bước.
- **Hồ sơ học sinh 360° (7 phân hệ):**
  1. Thông tin cá nhân, hộ chiếu, phụ huynh, kỹ năng/sở thích/năng lực cá nhân & định hướng ngành nghề.
  2. Học thuật (GPA, IELTS/SAT/TOPIK...), Hoạt động ngoại khóa & Giải thưởng/Thành tích.
  3. Hồ sơ tài chính gia đình & Mục tiêu Học bổng / Financial Aid.
  4. Danh sách trường mục tiêu & Nguyện vọng (`Reach` / `Match` / `Safety`).
  5. Quản lý Bài luận (Essays), Thư giới thiệu (LOR) & Lộ trình công việc (Tasks/Milestones).
  6. Checklist Giấy tờ theo quốc gia (hỗ trợ tải file trực tiếp + gắn link Google Drive + kiểm duyệt).
  7. Nhật ký hoạt động & Ghi chú trao đổi nội bộ.
- **Xuất PDF Hồ sơ năng lực (Brag Sheet):** Chuẩn in A4 để gửi cố vấn viết luận, người viết thư giới thiệu hoặc đối tác.

## Hướng dẫn cài đặt & chạy dự án

```bash
# 1. Cài đặt dependencies
npm install

# 2. Tạo file biến môi trường
cp .env.example .env

# 3. Khởi tạo cơ sở dữ liệu SQLite & nạp dữ liệu mẫu
npx prisma db push
npm run db:seed

# 4. Chạy ứng dụng
npm run dev
```

Mở trình duyệt tại `http://localhost:3000`.
