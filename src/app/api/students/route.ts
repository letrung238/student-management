import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const whereClause =
    currentUser.role === "ADMIN"
      ? {}
      : {
          assignments: {
            some: {
              userId: currentUser.id,
            },
          },
        };

  const students = await prisma.student.findMany({
    where: whereClause,
    include: {
      assignments: {
        include: { user: true },
      },
      applications: {
        include: { school: true },
      },
      documents: true,
      roadmapTasks: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ students, currentUser });
}

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const count = await prisma.student.count();
  const code = body.code || `HS-2026-${String(count + 1).padStart(3, "0")}`;

  const assignedUserIds: string[] = Array.isArray(body.assignedUserIds)
    ? body.assignedUserIds
    : [];

  if (currentUser.role !== "ADMIN" && !assignedUserIds.includes(currentUser.id)) {
    assignedUserIds.push(currentUser.id);
  }

  const student = await prisma.student.create({
    data: {
      code,
      fullName: body.fullName,
      gender: body.gender || "Nữ",
      dob: body.dob || "2009-01-01",
      email: body.email || "",
      phone: body.phone || "",
      address: body.address || "",
      passportNumber: body.passportNumber || "",
      passportExpiry: body.passportExpiry || "",
      parentName: body.parentName || "",
      parentPhone: body.parentPhone || "",
      parentOccupation: body.parentOccupation || "",
      currentSchool: body.currentSchool || "",
      currentGrade: body.currentGrade || "Lớp 12",
      gpa: parseFloat(body.gpa) || 8.5,
      gpaScale: body.gpaScale || "10.0",
      englishTestType: body.englishTestType || "IELTS",
      englishScore: body.englishScore || "7.0",
      standardizedTests: body.standardizedTests || "",
      targetCountries: body.targetCountries || "Mỹ",
      targetIntake: body.targetIntake || "Fall 2027",
      targetDegree: body.targetDegree || "Cử nhân (Bachelor)",
      targetMajors: body.targetMajors || "",
      careerOrientation: body.careerOrientation || "",
      skillsAndInterests: body.skillsAndInterests || "",
      strengthsSummary: body.strengthsSummary || "",
      annualBudget: body.annualBudget || "$30,000 / năm",
      savingsAmount: body.savingsAmount || "",
      parentsIncome: body.parentsIncome || "",
      assetsInfo: body.assetsInfo || "",
      scholarshipTarget: body.scholarshipTarget || "",
      pipelineStage: body.pipelineStage || "PREPARING",
      assignments: {
        create: assignedUserIds.map((uid) => ({
          userId: uid,
          roleLabel: "Phụ trách hồ sơ",
        })),
      },
    },
  });

  // Tự động nạp mẫu Checklist giấy tờ theo quốc gia mục tiêu
  const countries = (body.targetCountries || "Mỹ")
    .split(",")
    .map((c: string) => c.trim())
    .filter(Boolean);

  if (countries.length > 0) {
    const templates = await prisma.countryTemplate.findMany({
      where: { country: { in: countries } },
    });
    if (templates.length > 0) {
      await prisma.studentDocument.createMany({
        data: templates.map((t) => ({
          studentId: student.id,
          name: t.documentName,
          category: t.category,
          country: t.country,
          status: "MISSING",
        })),
      });
    }
  }

  await prisma.activityNote.create({
    data: {
      studentId: student.id,
      userId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      content: `Đã khởi tạo hồ sơ học sinh ${student.fullName} (${student.code}) với mục tiêu du học ${student.targetCountries}.`,
      noteType: "STATUS_CHANGE",
    },
  });

  return NextResponse.json({ student });
}
