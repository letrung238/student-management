import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, canUserAccessStudent } from "@/lib/auth";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: studentId } = await context.params;
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: { assignments: true },
  });

  if (!student || !canUserAccessStudent(currentUser, student.assignments)) {
    return NextResponse.json({ error: "Không có quyền truy cập" }, { status: 403 });
  }

  const body = await request.json();
  const { type, action, payload } = body;

  // 1. Nhóm nhân viên phụ trách (assignments)
  if (type === "assignment") {
    if (action === "add") {
      const record = await prisma.studentAssignment.upsert({
        where: {
          studentId_userId: {
            studentId,
            userId: payload.userId,
          },
        },
        update: { roleLabel: payload.roleLabel || "Phụ trách hồ sơ" },
        create: {
          studentId,
          userId: payload.userId,
          roleLabel: payload.roleLabel || "Phụ trách hồ sơ",
        },
      });
      return NextResponse.json({ record });
    }
    if (action === "delete") {
      await prisma.studentAssignment.delete({
        where: { id: payload.id },
      });
      return NextResponse.json({ ok: true });
    }
  }

  // 2. Học thuật & Điểm thi chuẩn hóa
  if (type === "academic") {
    if (action === "create") {
      const record = await prisma.academicRecord.create({
        data: {
          studentId,
          levelName: payload.levelName,
          institution: payload.institution,
          year: payload.year,
          scoreDetail: payload.scoreDetail,
          notes: payload.notes || "",
        },
      });
      return NextResponse.json({ record });
    }
    if (action === "delete") {
      await prisma.academicRecord.delete({ where: { id: payload.id } });
      return NextResponse.json({ ok: true });
    }
  }

  // 3. Hoạt động ngoại khóa
  if (type === "extracurricular") {
    if (action === "create") {
      const record = await prisma.extracurricular.create({
        data: {
          studentId,
          title: payload.title,
          organization: payload.organization,
          role: payload.role,
          category: payload.category || "Lãnh đạo & Cộng đồng",
          duration: payload.duration,
          description: payload.description,
          proofUrl: payload.proofUrl || "",
        },
      });
      return NextResponse.json({ record });
    }
    if (action === "delete") {
      await prisma.extracurricular.delete({ where: { id: payload.id } });
      return NextResponse.json({ ok: true });
    }
  }

  // 4. Giải thưởng & Thành tích
  if (type === "award") {
    if (action === "create") {
      const record = await prisma.award.create({
        data: {
          studentId,
          title: payload.title,
          level: payload.level || "Quốc gia",
          issuer: payload.issuer,
          year: payload.year,
          description: payload.description || "",
          proofUrl: payload.proofUrl || "",
        },
      });
      return NextResponse.json({ record });
    }
    if (action === "delete") {
      await prisma.award.delete({ where: { id: payload.id } });
      return NextResponse.json({ ok: true });
    }
  }

  // 5. Nguyện vọng nộp trường (Reach / Match / Safety) - Hỗ trợ tạo nhanh trường mới nếu chưa có
  if (type === "application") {
    if (action === "create") {
      let schoolId = payload.schoolId;

      if (!schoolId && payload.newSchoolName) {
        const createdSchool = await prisma.school.create({
          data: {
            name: payload.newSchoolName,
            country: payload.newSchoolCountry || "Mỹ",
            city: payload.newSchoolCity || "",
            ranking: payload.newSchoolRanking || "",
            tuitionRange: payload.newSchoolTuition || "",
          },
        });
        schoolId = createdSchool.id;
      }

      const record = await prisma.application.create({
        data: {
          studentId,
          schoolId,
          major: payload.major,
          degreeLevel: payload.degreeLevel || "Cử nhân",
          intake: payload.intake || student.targetIntake,
          category: payload.category || "MATCH",
          status: payload.status || "PREPARING",
          deadline: payload.deadline || "",
          scholarshipResult: payload.scholarshipResult || "",
          notes: payload.notes || "",
        },
      });
      return NextResponse.json({ record });
    }
    if (action === "update") {
      const record = await prisma.application.update({
        where: { id: payload.id },
        data: {
          status: payload.status,
          category: payload.category,
          scholarshipResult: payload.scholarshipResult,
          notes: payload.notes,
        },
      });
      return NextResponse.json({ record });
    }
    if (action === "delete") {
      await prisma.application.delete({ where: { id: payload.id } });
      return NextResponse.json({ ok: true });
    }
  }

  // 6. Bài luận (Essays)
  if (type === "essay") {
    if (action === "create") {
      const record = await prisma.essay.create({
        data: {
          studentId,
          title: payload.title,
          essayType: payload.essayType || "Personal Statement",
          targetSchool: payload.targetSchool || "Common App",
          wordCountTarget: parseInt(payload.wordCountTarget) || 650,
          status: payload.status || "DRAFTING",
          externalUrl: payload.externalUrl || "",
          fileUrl: payload.fileUrl || "",
          fileName: payload.fileName || "",
          feedback: payload.feedback || "",
        },
      });
      return NextResponse.json({ record });
    }
    if (action === "update") {
      const record = await prisma.essay.update({
        where: { id: payload.id },
        data: {
          status: payload.status,
          externalUrl: payload.externalUrl,
          fileUrl: payload.fileUrl,
          fileName: payload.fileName,
          feedback: payload.feedback,
        },
      });
      return NextResponse.json({ record });
    }
    if (action === "delete") {
      await prisma.essay.delete({ where: { id: payload.id } });
      return NextResponse.json({ ok: true });
    }
  }

  // 7. Thư giới thiệu (LOR)
  if (type === "recommendation") {
    if (action === "create") {
      const record = await prisma.recommendationLetter.create({
        data: {
          studentId,
          recommenderName: payload.recommenderName,
          recommenderTitle: payload.recommenderTitle,
          recommenderEmail: payload.recommenderEmail || "",
          relationship: payload.relationship || "",
          status: payload.status || "REQUESTED",
          externalUrl: payload.externalUrl || "",
          fileUrl: payload.fileUrl || "",
          fileName: payload.fileName || "",
          notes: payload.notes || "",
        },
      });
      return NextResponse.json({ record });
    }
    if (action === "update") {
      const record = await prisma.recommendationLetter.update({
        where: { id: payload.id },
        data: {
          status: payload.status,
          externalUrl: payload.externalUrl,
          fileUrl: payload.fileUrl,
          fileName: payload.fileName,
          notes: payload.notes,
        },
      });
      return NextResponse.json({ record });
    }
    if (action === "delete") {
      await prisma.recommendationLetter.delete({ where: { id: payload.id } });
      return NextResponse.json({ ok: true });
    }
  }

  // 8. Checklist Giấy tờ (File tải trực tiếp + Link Google Drive)
  if (type === "document") {
    if (action === "create") {
      const record = await prisma.studentDocument.create({
        data: {
          studentId,
          name: payload.name,
          category: payload.category || "Học thuật",
          country: payload.country || "",
          status: payload.status || "PENDING_REVIEW",
          fileUrl: payload.fileUrl || "",
          fileName: payload.fileName || "",
          externalUrl: payload.externalUrl || "",
          reviewerNote: payload.reviewerNote || "",
        },
      });
      return NextResponse.json({ record });
    }
    if (action === "update") {
      const record = await prisma.studentDocument.update({
        where: { id: payload.id },
        data: {
          status: payload.status,
          fileUrl: payload.fileUrl,
          fileName: payload.fileName,
          externalUrl: payload.externalUrl,
          reviewerNote: payload.reviewerNote,
        },
      });
      await prisma.activityNote.create({
        data: {
          studentId,
          userId: currentUser.id,
          authorName: currentUser.name,
          authorRole: currentUser.role,
          content: `Cập nhật giấy tờ "${record.name}" sang trạng thái [${record.status}].`,
          noteType: "DOCUMENT_UPDATE",
        },
      });
      return NextResponse.json({ record });
    }
    if (action === "load_template") {
      const country = payload.country;
      const templates = await prisma.countryTemplate.findMany({
        where: { country },
      });
      const existingDocs = await prisma.studentDocument.findMany({
        where: { studentId },
      });
      const existingNames = new Set(existingDocs.map((d) => d.name));
      const toCreate = templates.filter((t) => !existingNames.has(t.documentName));
      if (toCreate.length > 0) {
        await prisma.studentDocument.createMany({
          data: toCreate.map((t) => ({
            studentId,
            name: t.documentName,
            category: t.category,
            country: t.country,
            status: "MISSING",
          })),
        });
      }
      return NextResponse.json({ addedCount: toCreate.length });
    }
    if (action === "delete") {
      await prisma.studentDocument.delete({ where: { id: payload.id } });
      return NextResponse.json({ ok: true });
    }
  }

  // 9. Lộ trình công việc & Deadline (Roadmap Tasks)
  if (type === "task") {
    if (action === "create") {
      const record = await prisma.roadmapTask.create({
        data: {
          studentId,
          title: payload.title,
          category: payload.category || "Hồ sơ trường",
          dueDate: payload.dueDate,
          priority: payload.priority || "HIGH",
          completed: false,
          assigneeName: payload.assigneeName || currentUser.name,
        },
      });
      return NextResponse.json({ record });
    }
    if (action === "toggle") {
      const record = await prisma.roadmapTask.update({
        where: { id: payload.id },
        data: { completed: payload.completed },
      });
      return NextResponse.json({ record });
    }
    if (action === "delete") {
      await prisma.roadmapTask.delete({ where: { id: payload.id } });
      return NextResponse.json({ ok: true });
    }
  }

  // 10. Nhật ký & Ghi chú trao đổi nội bộ
  if (type === "note") {
    if (action === "create") {
      const record = await prisma.activityNote.create({
        data: {
          studentId,
          userId: currentUser.id,
          authorName: currentUser.name,
          authorRole: currentUser.role,
          content: payload.content,
          noteType: "COMMENT",
        },
      });
      return NextResponse.json({ record });
    }
  }

  return NextResponse.json({ error: "Hành động không hợp lệ" }, { status: 400 });
}
