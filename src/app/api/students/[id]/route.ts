import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, canUserAccessStudent } from "@/lib/auth";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.student.findUnique({
    where: { id },
    include: { assignments: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "Không tìm thấy hồ sơ" }, { status: 404 });
  }

  if (!canUserAccessStudent(currentUser, existing.assignments)) {
    return NextResponse.json(
      { error: "Bạn không nằm trong nhóm nhân viên phụ trách hồ sơ này" },
      { status: 403 }
    );
  }

  const body = await request.json();

  const updated = await prisma.student.update({
    where: { id },
    data: {
      fullName: body.fullName ?? existing.fullName,
      gender: body.gender ?? existing.gender,
      dob: body.dob ?? existing.dob,
      email: body.email ?? existing.email,
      phone: body.phone ?? existing.phone,
      address: body.address ?? existing.address,
      passportNumber: body.passportNumber ?? existing.passportNumber,
      passportExpiry: body.passportExpiry ?? existing.passportExpiry,
      parentName: body.parentName ?? existing.parentName,
      parentPhone: body.parentPhone ?? existing.parentPhone,
      parentOccupation: body.parentOccupation ?? existing.parentOccupation,
      currentSchool: body.currentSchool ?? existing.currentSchool,
      currentGrade: body.currentGrade ?? existing.currentGrade,
      gpa: body.gpa !== undefined ? parseFloat(body.gpa) : existing.gpa,
      gpaScale: body.gpaScale ?? existing.gpaScale,
      englishTestType: body.englishTestType ?? existing.englishTestType,
      englishScore: body.englishScore ?? existing.englishScore,
      standardizedTests: body.standardizedTests ?? existing.standardizedTests,
      targetCountries: body.targetCountries ?? existing.targetCountries,
      targetIntake: body.targetIntake ?? existing.targetIntake,
      targetDegree: body.targetDegree ?? existing.targetDegree,
      targetMajors: body.targetMajors ?? existing.targetMajors,
      careerOrientation: body.careerOrientation ?? existing.careerOrientation,
      skillsAndInterests: body.skillsAndInterests ?? existing.skillsAndInterests,
      strengthsSummary: body.strengthsSummary ?? existing.strengthsSummary,
      annualBudget: body.annualBudget ?? existing.annualBudget,
      savingsAmount: body.savingsAmount ?? existing.savingsAmount,
      parentsIncome: body.parentsIncome ?? existing.parentsIncome,
      assetsInfo: body.assetsInfo ?? existing.assetsInfo,
      scholarshipTarget: body.scholarshipTarget ?? existing.scholarshipTarget,
      pipelineStage: body.pipelineStage ?? existing.pipelineStage,
    },
  });

  if (body.pipelineStage && body.pipelineStage !== existing.pipelineStage) {
    await prisma.activityNote.create({
      data: {
        studentId: id,
        userId: currentUser.id,
        authorName: currentUser.name,
        authorRole: currentUser.role,
        content: `Đã chuyển trạng thái tiến độ hồ sơ từ [${existing.pipelineStage}] sang [${body.pipelineStage}].`,
        noteType: "STATUS_CHANGE",
      },
    });
  }

  return NextResponse.json({ student: updated });
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Chỉ Admin mới có quyền xóa hồ sơ học sinh" },
      { status: 403 }
    );
  }

  await prisma.student.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
