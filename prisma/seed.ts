import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Bắt đầu khởi tạo dữ liệu mẫu cho hệ thống Quản lý Hồ sơ Du học...");

  await prisma.activityNote.deleteMany();
  await prisma.roadmapTask.deleteMany();
  await prisma.studentDocument.deleteMany();
  await prisma.recommendationLetter.deleteMany();
  await prisma.essay.deleteMany();
  await prisma.application.deleteMany();
  await prisma.award.deleteMany();
  await prisma.extracurricular.deleteMany();
  await prisma.academicRecord.deleteMany();
  await prisma.studentAssignment.deleteMany();
  await prisma.student.deleteMany();
  await prisma.school.deleteMany();
  await prisma.countryTemplate.deleteMany();
  await prisma.user.deleteMany();

  // 1. Tạo nhân sự nội bộ (3 vai trò: ADMIN, COUNSELOR, CASE_OFFICER)
  const admin = await prisma.user.create({
    data: {
      id: "user-admin",
      name: "Trần Minh Quản Trị",
      email: "admin@edupath.vn",
      role: "ADMIN",
      title: "Giám đốc Điều hành & Quản trị Hệ thống",
      phone: "0901 234 567",
      avatarColor: "#1d4ed8",
    },
  });

  const counselor1 = await prisma.user.create({
    data: {
      id: "user-counselor-1",
      name: "Nguyễn Lan Anh",
      email: "lananh.counselor@edupath.vn",
      role: "COUNSELOR",
      title: "Chuyên viên Tư vấn Học bổng Mỹ - Canada",
      phone: "0912 345 678",
      avatarColor: "#047857",
    },
  });

  const counselor2 = await prisma.user.create({
    data: {
      id: "user-counselor-2",
      name: "Lê Hoàng Nam",
      email: "hoangnam.counselor@edupath.vn",
      role: "COUNSELOR",
      title: "Chuyên viên Tư vấn Úc - Châu Âu - Á",
      phone: "0934 567 890",
      avatarColor: "#7c3aed",
    },
  });

  const officer1 = await prisma.user.create({
    data: {
      id: "user-officer-1",
      name: "Phạm Thu Hà",
      email: "thuha.officer@edupath.vn",
      role: "CASE_OFFICER",
      title: "Chuyên viên Xử lý Hồ sơ & Visa (Case Officer)",
      phone: "0978 123 456",
      avatarColor: "#b45309",
    },
  });

  const officer2 = await prisma.user.create({
    data: {
      id: "user-officer-2",
      name: "Đỗ Quốc Bảo",
      email: "quocbao.officer@edupath.vn",
      role: "CASE_OFFICER",
      title: "Chuyên viên Hồ sơ Tài chính & Dịch thuật",
      phone: "0988 765 432",
      avatarColor: "#be123c",
    },
  });

  // 2. Tạo Danh mục Trường đối tác
  const schools = await Promise.all([
    prisma.school.create({
      data: {
        id: "sch-nyu",
        name: "New York University (NYU)",
        country: "Mỹ",
        city: "New York, NY",
        ranking: "#35 US News National",
        tuitionRange: "$60,000 - $65,000 / năm",
        defaultRequirements: "GPA >= 3.7/4.0, IELTS 7.5 / TOEFL 100+, SAT 1500+ (Optional)",
        website: "https://www.nyu.edu",
      },
    }),
    prisma.school.create({
      data: {
        id: "sch-purdue",
        name: "Purdue University",
        country: "Mỹ",
        city: "West Lafayette, IN",
        ranking: "#43 US News (#8 Engineering)",
        tuitionRange: "$31,000 - $35,000 / năm",
        defaultRequirements: "GPA >= 8.5/10, IELTS 6.5+, SAT 1380+",
        website: "https://www.purdue.edu",
      },
    }),
    prisma.school.create({
      data: {
        id: "sch-umass",
        name: "UMass Amherst",
        country: "Mỹ",
        city: "Amherst, MA",
        ranking: "#67 US News (Top CS)",
        tuitionRange: "$39,000 / năm (Học bổng lên tới $16,000/năm)",
        defaultRequirements: "GPA >= 8.2/10, IELTS 6.5+",
        website: "https://www.umass.edu",
      },
    }),
    prisma.school.create({
      data: {
        id: "sch-utoronto",
        name: "University of Toronto",
        country: "Canada",
        city: "Toronto, ON",
        ranking: "#1 Canada / #21 QS World",
        tuitionRange: "CAD 60,000 / năm",
        defaultRequirements: "GPA >= 8.8/10, IELTS 6.5 (không kỹ năng nào dưới 6.0)",
        website: "https://www.utoronto.ca",
      },
    }),
    prisma.school.create({
      data: {
        id: "sch-unimelb",
        name: "The University of Melbourne",
        country: "Úc",
        city: "Melbourne, VIC",
        ranking: "#1 Úc / #13 QS World",
        tuitionRange: "AUD 48,000 - 54,000 / năm",
        defaultRequirements: "GPA >= 8.5/10 (Trường chuyên/Top), IELTS 6.5 - 7.0",
        website: "https://www.unimelb.edu.au",
      },
    }),
    prisma.school.create({
      data: {
        id: "sch-monash",
        name: "Monash University",
        country: "Úc",
        city: "Melbourne, VIC",
        ranking: "#37 QS World (Group of Eight)",
        tuitionRange: "AUD 45,000 / năm",
        defaultRequirements: "GPA >= 8.0/10, IELTS 6.5",
        website: "https://www.monash.edu",
      },
    }),
    prisma.school.create({
      data: {
        id: "sch-yonsei",
        name: "Yonsei University (Underwood International College)",
        country: "Hàn Quốc",
        city: "Seoul",
        ranking: "Top 3 SKY Hàn Quốc / #56 QS World",
        tuitionRange: "$12,500 / năm",
        defaultRequirements: "GPA >= 8.5/10, IELTS 7.0 hoặc TOPIK 5+",
        website: "https://uic.yonsei.ac.kr",
      },
    }),
    prisma.school.create({
      data: {
        id: "sch-tum",
        name: "Technical University of Munich (TUM)",
        country: "Đức",
        city: "Munich",
        ranking: "#1 Đức / #28 QS World",
        tuitionRange: "EUR 4,000 - 6,000 / học kỳ (Sinh viên quốc tế)",
        defaultRequirements: "GPA >= 8.0, TestAS, IELTS 6.5 / Tiếng Đức B2",
        website: "https://www.tum.de",
      },
    }),
  ]);

  // 3. Tạo Mẫu Checklist Giấy tờ theo Quốc gia
  const templates = [
    // Mỹ
    { country: "Mỹ", documentName: "Hộ chiếu còn hạn trên 6 tháng (Passport)", category: "Cá nhân", required: true, description: "Bản scan màu trang thông tin và các trang có dấu visa cũ" },
    { country: "Mỹ", documentName: "Học bạ THPT 3 năm gần nhất (Bản dịch công chứng tiếng Anh)", category: "Học thuật", required: true, description: "Kèm bảng điểm chính thức có dấu niêm phong của trường" },
    { country: "Mỹ", documentName: "Chứng chỉ IELTS / TOEFL / SAT chính thức", category: "Học thuật", required: true, description: "Bản PDF điểm chuẩn hóa để gửi báo cáo điểm cho trường" },
    { country: "Mỹ", documentName: "Giấy xác nhận số dư Sổ tiết kiệm (Bank Statement)", category: "Tài chính", required: true, description: "Song ngữ Anh - Việt, số dư tối thiểu bằng 1 năm chi phí học tập (I-20)" },
    { country: "Mỹ", documentName: "Hồ sơ chứng minh thu nhập & tài sản bố mẹ", category: "Tài chính", required: true, description: "Hợp đồng lao động, sao kê lương 6 tháng, giấy phép ĐKKD, sổ đỏ..." },
    { country: "Mỹ", documentName: "Mẫu đơn I-20 & Biên lai đóng phí SEVIS I-901", category: "Visa", required: true, description: "Dùng để đặt lịch phỏng vấn Visa F-1 tại ĐSQ/LSQ Mỹ" },
    // Úc
    { country: "Úc", documentName: "Hộ chiếu & Căn cước công dân + Giấy khai sinh", category: "Cá nhân", required: true, description: "Bản dịch thuật công chứng tiếng Anh" },
    { country: "Úc", documentName: "Học bạ & Bằng tốt nghiệp + Chứng chỉ IELTS PTE", category: "Học thuật", required: true, description: "Nộp xin thư mời nhập học (Offer Letter)" },
    { country: "Úc", documentName: "Bản giải trình GSR (Genuine Student Requirement)", category: "Visa", required: true, description: "Giải trình kế hoạch học tập và ràng buộc quay về/định hướng nghề nghiệp" },
    { country: "Úc", documentName: "Chứng nhận CoE (Confirmation of Enrolment) & Bảo hiểm OSHC", category: "Visa", required: true, description: "Sau khi đóng đặt cọc học phí cho trường tại Úc" },
    // Canada
    { country: "Canada", documentName: "Thư chấp nhận nhập học LOA (Letter of Acceptance) & PAL", category: "Visa", required: true, description: "Thư mời chính thức từ trường DLI tại Canada kèm Provincial Attestation Letter" },
    { country: "Canada", documentName: "Hồ sơ tài chính gia đình & Sổ tiết kiệm / GIC", category: "Tài chính", required: true, description: "Sao kê ngân hàng, giấy tờ thuế, sổ đỏ và nguồn thu nhập bảo lãnh" },
    // Hàn Quốc
    { country: "Hàn Quốc", documentName: "Học bạ & Bằng tốt nghiệp dán tem tím Lãnh sự quán / Apostille", category: "Học thuật", required: true, description: "Hợp pháp hóa lãnh sự tại Bộ Ngoại giao và ĐSQ Hàn Quốc" },
    { country: "Hàn Quốc", documentName: "Chứng chỉ TOPIK / IELTS & Kế hoạch học tập (Study Plan)", category: "Học thuật", required: true, description: "Viết tay hoặc đánh máy theo mẫu trường đại học Hàn Quốc" },
    { country: "Hàn Quốc", documentName: "Sổ tiết kiệm K-Study / Mở sổ đóng băng tại ngân hàng Hàn Quốc", category: "Tài chính", required: true, description: "Woori Bank / Shinhan Bank theo quy định Visa D-2 / D-4" },
  ];

  await prisma.countryTemplate.createMany({ data: templates });

  // 4. Tạo 4 Hồ sơ Học sinh mẫu cực kỳ chi tiết ở 4 bước Pipeline khác nhau
  // HỌC SINH 1: Đang chuẩn bị hồ sơ (PREPARING) - Hồ sơ săn học bổng Mỹ/Canada ngành AI & Computer Science
  const student1 = await prisma.student.create({
    data: {
      id: "stu-01",
      code: "HS-2026-001",
      fullName: "Nguyễn Minh Khôi",
      gender: "Nam",
      dob: "2009-04-15",
      email: "minhkhoi.nguyen09@gmail.com",
      phone: "0918 223 344",
      address: "Quận Cầu Giấy, Hà Nội",
      passportNumber: "C9823412",
      passportExpiry: "2033-08-20",
      parentName: "Ông Nguyễn Văn Hùng & Bà Lê Thị Mai",
      parentPhone: "0903 445 566",
      parentOccupation: "Bố: Giám đốc Công ty Thiết bị Y tế | Mẹ: Trưởng phòng Tài chính Ngân hàng",
      currentSchool: "THPT Chuyên Hà Nội - Amsterdam",
      currentGrade: "Lớp 12 Chuyên Tin",
      gpa: 9.4,
      gpaScale: "10.0",
      englishTestType: "IELTS",
      englishScore: "8.0 (L:8.5, R:8.5, W:7.0, S:7.5)",
      standardizedTests: "SAT: 1540/1600 (Math 800, RW 740) | AP Calculus BC: 5/5 | AP Computer Science A: 5/5",
      targetCountries: "Mỹ, Canada",
      targetIntake: "Fall 2027",
      targetDegree: "Cử nhân (Bachelor of Science)",
      targetMajors: "Computer Science, Artificial Intelligence & Data Science",
      careerOrientation:
        "Định hướng trở thành Kỹ sư Nghiên cứu AI ứng dụng trong Chẩn đoán Y tế (Medical Imaging AI). Mục tiêu thực tập Co-op tại các lab AI ở Bắc Mỹ từ năm 2 đại học, sau tốt nghiệp làm việc 3 năm theo diện OPT/PGWP tại Silicon Valley hoặc Toronto trước khi học tiếp Thạc sĩ.",
      skillsAndInterests:
        "• Kỹ năng chuyên môn: Lập trình Python, C++, PyTorch, Computer Vision, Full-stack Web (Next.js).\n• Năng lực cá nhân: Tư duy giải quyết vấn đề thuật toán, lãnh đạo đội nhóm kỹ thuật 35 thành viên, thuyết trình tiếng Anh học thuật.\n• Sở thích: Cờ vua (Elo 1850), Chế tạo Robot (FTC), Chạy bộ bán chuyên (Half-Marathon).",
      strengthsSummary:
        "Hồ sơ STEM sắc bén với điểm SAT Math tuyệt đối 800, có sản phẩm AI thực tế áp dụng tại bệnh viện địa phương và giải thưởng Tin học cấp Quốc gia.",
      annualBudget: "$38,000 - $42,000 / năm (Gia đình chi trả tối đa)",
      savingsAmount: "2,2 tỷ VNĐ (~$88,000) tại Ngân hàng Vietcombank (Đã gửi kỳ hạn 12 tháng)",
      parentsIncome: "Tổng thu nhập sau thuế ~140 triệu VNĐ/tháng (Sao kê lương + Lợi nhuận doanh nghiệp có đóng thuế đầy đủ)",
      assetsInfo: "01 Biệt thự liền kề tại Cầu Giấy (Hà Nội), 01 Căn hộ chung cư cho thuê, 01 Ô tô Mercedes GLC",
      scholarshipTarget: "Săn học bổng Merit Scholarship / Financial Aid từ 40% - 70% học phí ($20,000 - $35,000/năm)",
      pipelineStage: "PREPARING",
    },
  });

  // Phân công nhóm phụ trách cho Học sinh 1 (Lan Anh + Thu Hà + Quốc Bảo)
  await prisma.studentAssignment.createMany({
    data: [
      { studentId: student1.id, userId: counselor1.id, roleLabel: "Tư vấn chiến lược & Chọn trường" },
      { studentId: student1.id, userId: officer1.id, roleLabel: "Xử lý hồ sơ & Quản lý tiến độ" },
      { studentId: student1.id, userId: officer2.id, roleLabel: "Thẩm định hồ sơ tài chính" },
    ],
  });

  await prisma.academicRecord.createMany({
    data: [
      { studentId: student1.id, levelName: "Lớp 10 THPT Chuyên Tin", institution: "THPT Chuyên Hà Nội - Amsterdam", year: "2024 - 2025", scoreDetail: "GPA 9.2/10 (Toán 9.6, Tin 9.8, Anh 9.4)", notes: "Top 5% khối chuyên" },
      { studentId: student1.id, levelName: "Lớp 11 THPT Chuyên Tin", institution: "THPT Chuyên Hà Nội - Amsterdam", year: "2025 - 2026", scoreDetail: "GPA 9.5/10 (Toán 9.8, Tin 9.9, Lý 9.3)", notes: "Học sinh Xuất sắc toàn diện" },
      { studentId: student1.id, levelName: "SAT Reasoning Test", institution: "College Board", year: "08/2026", scoreDetail: "1540 / 1600 (Math: 800, Reading & Writing: 740)", notes: "Top 1% toàn cầu" },
      { studentId: student1.id, levelName: "IELTS Academic", institution: "IDP Education", year: "05/2026", scoreDetail: "8.0 Overall (L: 8.5, R: 8.5, W: 7.0, S: 7.5)", notes: "Còn hiệu lực đến 05/2028" },
    ],
  });

  await prisma.extracurricular.createMany({
    data: [
      {
        studentId: student1.id,
        title: "Dự án MedScreen AI - Ứng dụng AI sàng lọc sớm bệnh lý võng mạc",
        organization: "Nhóm Nghiên cứu Trẻ VietAI Youth & Khoa Mắt BV Đa khoa",
        role: "Co-Founder & Lead AI Developer",
        category: "Nghiên cứu & Công nghệ",
        duration: "01/2025 - Hiện tại (8 giờ/tuần)",
        description: "Huấn luyện mô hình CNN trên 12.000 ảnh đáy mắt, đạt độ chính xác 91.4%. Thử nghiệm thực tế hỗ trợ sàng lọc miễn phí cho 450 bệnh nhân cao tuổi tại 3 đợt khám thiện nguyện.",
        proofUrl: "https://drive.google.com/drive/folders/medscreen-ai-portfolio",
      },
      {
        studentId: student1.id,
        title: "CLB Robotics & Lập trình Ams (GART Robotics)",
        organization: "THPT Chuyên Hà Nội - Amsterdam",
        role: "Trưởng ban Lập trình Điều khiển (Head of Software)",
        category: "Lãnh đạo & STEM",
        duration: "09/2024 - Hiện tại (6 giờ/tuần)",
        description: "Dẫn dắt 15 thành viên phát triển thuật toán tự hành (Autonomous navigation) cho robot thi đấu FIRST Tech Challenge; tổ chức trại hè STEM cho 200 học sinh THCS.",
        proofUrl: "https://drive.google.com/drive/folders/gart-robotics-cert",
      },
      {
        studentId: student1.id,
        title: "Dự án Thiện nguyện Code4Kids Vùng Cao",
        organization: "Tổ chức Giáo dục STEAM for Vietnam Partner",
        role: "Trưởng nhóm Giảng dạy Tình nguyện",
        category: "Tình nguyện & Cộng đồng",
        duration: "06/2025 - 09/2026 (4 giờ/tuần)",
        description: "Quyên góp 25 máy tính cũ và trực tiếp dạy lập trình Scratch & Python cơ bản cho 120 học sinh tại Yên Bái và Hà Giang.",
        proofUrl: "https://drive.google.com/drive/folders/code4kids-impact",
      },
    ],
  });

  await prisma.award.createMany({
    data: [
      {
        studentId: student1.id,
        title: "Giải Nhì Học sinh Giỏi Quốc gia môn Tin học",
        level: "Quốc gia",
        issuer: "Bộ Giáo dục & Đào tạo Việt Nam",
        year: "2026",
        description: "Vượt qua hơn 600 thí sinh đội tuyển các tỉnh thành trên toàn quốc.",
        proofUrl: "https://drive.google.com/file/d/hsg-quocgia-tinhoc-2026",
      },
      {
        studentId: student1.id,
        title: "Huy chương Vàng Kỳ thi Olympic Trí tuệ Nhân tạo & Sáng tạo Khoa học Quốc tế (WICO)",
        level: "Quốc tế",
        issuer: "Korea University Invention Association (Seoul)",
        year: "2025",
        description: "Đề tài hệ thống AI hỗ trợ chẩn đoán hình ảnh y tế chi phí thấp.",
        proofUrl: "https://drive.google.com/file/d/wico-gold-medal-2025",
      },
      {
        studentId: student1.id,
        title: "Giải Nhất Cuộc thi FIRST Tech Challenge Vietnam (Giải Thiết kế Thuật toán Điều khiển)",
        level: "Quốc gia",
        issuer: "FIRST Vietnam",
        year: "2025",
        description: "Control Award Winner cùng đội tuyển Robotics của trường.",
      },
    ],
  });

  await prisma.application.createMany({
    data: [
      {
        studentId: student1.id,
        schoolId: "sch-nyu",
        major: "B.S. in Computer Science (Data Science Track)",
        degreeLevel: "Cử nhân",
        intake: "Fall 2027",
        category: "REACH",
        status: "PREPARING",
        deadline: "2027-01-05",
        scholarshipResult: "Đang xin Financial Aid $35,000/năm",
        notes: "Nộp đợt Regular Decision + Hồ sơ CSS Profile",
      },
      {
        studentId: student1.id,
        schoolId: "sch-purdue",
        major: "B.S. in Computer Science & Artificial Intelligence",
        degreeLevel: "Cử nhân",
        intake: "Fall 2027",
        category: "MATCH",
        status: "PREPARING",
        deadline: "2026-11-01",
        scholarshipResult: "Mục tiêu Merit Scholarship $10,000/năm",
        notes: "Ưu tiên nộp Early Action trước 01/11",
      },
      {
        studentId: student1.id,
        schoolId: "sch-umass",
        major: "B.S. in Computer Science (Manning CICS)",
        degreeLevel: "Cử nhân",
        intake: "Fall 2027",
        category: "SAFETY",
        status: "PREPARING",
        deadline: "2026-11-05",
        scholarshipResult: "Kỳ vọng Chancellor's Award $16,000/năm",
        notes: "Trường Safety chất lượng rất cao về AI/CS",
      },
      {
        studentId: student1.id,
        schoolId: "sch-utoronto",
        major: "Computer Science Co-op (St. George Campus)",
        degreeLevel: "Cử nhân",
        intake: "Fall 2027",
        category: "MATCH",
        status: "PREPARING",
        deadline: "2027-01-15",
        scholarshipResult: "Xét học bổng International Scholar",
        notes: "Cần hoàn thiện 4 câu Supplemental Application của UofT",
      },
    ],
  });

  await prisma.essay.createMany({
    data: [
      {
        studentId: student1.id,
        title: "Common App Personal Statement: Từ bàn cờ Vua tới thuật toán AI cứu thị lực cho ông ngoại",
        essayType: "Personal Statement",
        targetSchool: "Common App (Tất cả trường Mỹ)",
        wordCountTarget: 650,
        status: "REVIEWING",
        externalUrl: "https://docs.google.com/document/d/1xCommonApp_MinhKhoi_Draft3",
        feedback: "Draft 3 rất giàu cảm xúc! Cần gọt gọn đoạn mở đầu về cờ vua xuống 120 từ để dành đất cho trải nghiệm thực tế tại phòng khám mắt.",
      },
      {
        studentId: student1.id,
        title: "Why Purdue Computer Science & Honors College Supplemental Essay",
        essayType: "Supplemental Essay",
        targetSchool: "Purdue University",
        wordCountTarget: 250,
        status: "FINAL",
        externalUrl: "https://docs.google.com/document/d/1xPurdue_Supplemental_Final",
        feedback: "Đã duyệt bản chốt (Final). Nêu rất rõ giáo sư và lab ICON tại Purdue.",
      },
      {
        studentId: student1.id,
        title: "NYU Bridge Builder Prompt (Why NYU & Global Network)",
        essayType: "Supplemental Essay",
        targetSchool: "New York University (NYU)",
        wordCountTarget: 250,
        status: "DRAFTING",
        externalUrl: "https://docs.google.com/document/d/1xNYU_Draft1",
        feedback: "Đang viết bản nháp đầu tiên, hạn gửi cho chị Lan Anh review trước thứ Sáu.",
      },
    ],
  });

  await prisma.recommendationLetter.createMany({
    data: [
      {
        studentId: student1.id,
        recommenderName: "ThS. Đặng Quốc Tuấn",
        recommenderTitle: "Tổ trưởng Tổ Tin học - THPT Chuyên Hà Nội - Amsterdam",
        recommenderEmail: "tuandq@hn-ams.edu.vn",
        relationship: "Giáo viên chủ nhiệm & Huấn luyện đội tuyển HSG Quốc gia",
        status: "SUBMITTED",
        externalUrl: "https://drive.google.com/file/d/LOR_ThayTuan_Signed",
        notes: "Đã ký và upload lên hệ thống Common App Recommender.",
      },
      {
        studentId: student1.id,
        recommenderName: "TS. BS. Lê Minh Đức",
        recommenderTitle: "Trưởng khoa Mắt - Cố vấn chuyên môn dự án MedScreen AI",
        recommenderEmail: "dr.leminhduc@hospital.vn",
        relationship: "Mentor nghiên cứu dự án ngoại khóa AI Y tế",
        status: "DRAFTING",
        externalUrl: "https://docs.google.com/document/d/LOR_DrDuc_Draft",
        notes: "Đang chờ bác sĩ ký xác nhận bản tiếng Anh.",
      },
    ],
  });

  await prisma.studentDocument.createMany({
    data: [
      {
        studentId: student1.id,
        name: "Hộ chiếu còn hạn (Passport Scan)",
        category: "Cá nhân",
        country: "Mỹ",
        status: "APPROVED",
        fileName: "Passport_NguyenMinhKhoi_C9823412.pdf",
        fileUrl: "/uploads/sample-passport-minhkhoi.pdf",
        externalUrl: "https://drive.google.com/file/d/passport-minhkhoi",
        reviewerNote: "Bản scan rõ nét, hạn hộ chiếu tới năm 2033 hợp lệ.",
      },
      {
        studentId: student1.id,
        name: "Học bạ THPT Lớp 10 & Lớp 11 (Bản dịch tiếng Anh công chứng)",
        category: "Học thuật",
        country: "Mỹ",
        status: "APPROVED",
        fileName: "Transcript_Grade10_11_MinhKhoi.pdf",
        fileUrl: "/uploads/sample-transcript-minhkhoi.pdf",
        reviewerNote: "Đã khớp điểm GPA 9.4 và có dấu đỏ nhà trường.",
      },
      {
        studentId: student1.id,
        name: "Chứng chỉ SAT 1540 & IELTS 8.0 Score Report",
        category: "Học thuật",
        country: "Mỹ",
        status: "APPROVED",
        fileName: "SAT1540_IELTS80_MinhKhoi.pdf",
        fileUrl: "/uploads/sample-scores-minhkhoi.pdf",
        reviewerNote: "Đủ điều kiện mọi trường Top.",
      },
      {
        studentId: student1.id,
        name: "Giấy xác nhận Số dư Sổ tiết kiệm 2,2 tỷ VNĐ (Vietcombank)",
        category: "Tài chính",
        country: "Mỹ",
        status: "PENDING_REVIEW",
        externalUrl: "https://drive.google.com/file/d/vcb-bank-statement-2ty2",
        reviewerNote: "Mới tải lên link Google Drive, chờ anh Quốc Bảo kiểm tra ngày cấp song ngữ.",
      },
      {
        studentId: student1.id,
        name: "Hồ sơ Thu nhập & Thuế doanh nghiệp của Bố Mẹ (Dùng khai CSS Profile)",
        category: "Tài chính",
        country: "Mỹ",
        status: "NEEDS_REVISION",
        externalUrl: "https://drive.google.com/drive/folders/tax-income-2025",
        reviewerNote: "Thiếu tờ khai quyết toán thuế TNCN quý 4 của mẹ, cần bổ sung trước ngày 30/11.",
      },
    ],
  });

  await prisma.roadmapTask.createMany({
    data: [
      { studentId: student1.id, title: "Chốt bản Final bài luận chính Common App 650 từ", category: "Bài luận", dueDate: "2026-11-28", priority: "HIGH", completed: false, assigneeName: "Nguyễn Lan Anh" },
      { studentId: student1.id, title: "Bổ sung tờ khai thuế TNCN của mẹ để hoàn tất CSS Profile", category: "Tài chính & Visa", dueDate: "2026-11-30", priority: "HIGH", completed: false, assigneeName: "Đỗ Quốc Bảo" },
      { studentId: student1.id, title: "Nộp đơn Early Action trường Purdue & UMass Amherst", category: "Hồ sơ trường", dueDate: "2026-12-01", priority: "HIGH", completed: true, assigneeName: "Phạm Thu Hà" },
      { studentId: student1.id, title: "Thu thập chữ ký LOR từ TS.BS Lê Minh Đức", category: "Bài luận", dueDate: "2026-12-05", priority: "MEDIUM", completed: false, assigneeName: "Nguyễn Lan Anh" },
    ],
  });

  await prisma.activityNote.createMany({
    data: [
      {
        studentId: student1.id,
        userId: counselor1.id,
        authorName: "Nguyễn Lan Anh",
        authorRole: "COUNSELOR",
        content: "Đã họp 1-1 với Khôi và phụ huynh: Gia đình thống nhất mức đóng tối đa $40,000/năm. Danh sách trường đã chia cân đối 1 Reach (NYU), 2 Match (Purdue, UofT) và 1 Safety (UMass Amherst).",
        noteType: "COMMENT",
      },
      {
        studentId: student1.id,
        userId: officer2.id,
        authorName: "Đỗ Quốc Bảo",
        authorRole: "CASE_OFFICER",
        content: "Đã kiểm tra sổ tiết kiệm 2.2 tỷ Vietcombank. Đã nhắn phụ huynh bổ sung thêm sao kê lương 3 tháng gần nhất của mẹ để khai CSS Profile xin Financial Aid trường NYU.",
        noteType: "DOCUMENT_UPDATE",
      },
    ],
  });

  // HỌC SINH 2: Đã nộp trường (SUBMITTED) - Hồ sơ Du học Úc ngành Kinh doanh & Phân tích Dữ liệu (Business Analytics)
  const student2 = await prisma.student.create({
    data: {
      id: "stu-02",
      code: "HS-2026-002",
      fullName: "Trần Ngọc Bảo Trâm",
      gender: "Nữ",
      dob: "2009-07-22",
      email: "baotram.tran22@gmail.com",
      phone: "0932 889 900",
      address: "Quận 3, TP. Hồ Chí Minh",
      passportNumber: "C7611234",
      passportExpiry: "2032-11-10",
      parentName: "Ông Trần Quốc Tuấn & Bà Võ Thị Thanh",
      parentPhone: "0908 112 233",
      parentOccupation: "Chủ Doanh nghiệp Xuất nhập khẩu Nông sản tại TP.HCM",
      currentSchool: "THPT Chuyên Lê Hồng Phong TP.HCM",
      currentGrade: "Lớp 12 Chuyên Anh",
      gpa: 9.1,
      gpaScale: "10.0",
      englishTestType: "IELTS",
      englishScore: "7.5 (L:8.0, R:7.5, W:7.0, S:7.5)",
      standardizedTests: "SAT: 1460/1600",
      targetCountries: "Úc",
      targetIntake: "Semester 1 (Feb 2027)",
      targetDegree: "Cử nhân (Bachelor of Commerce)",
      targetMajors: "Business Analytics, Finance & Supply Chain Management",
      careerOrientation:
        "Định hướng trở thành Chuyên gia Phân tích Chuỗi cung ứng & Tài chính doanh nghiệp (Business & Supply Chain Analyst) tại khu vực Châu Á - Thái Bình Dương, kết hợp hiện đại hóa doanh nghiệp xuất khẩu gia đình.",
      skillsAndInterests:
        "• Kỹ năng: Phân tích dữ liệu Excel/PowerBI, Hùng biện tiếng Anh (Debate), Tổ chức sự kiện & Gây quỹ tài trợ.\n• Năng lực cá nhân: Khả năng giao tiếp thuyết phục, tư duy thương mại nhạy bén.\n• Sở thích: Piano (ABRSM Grade 6), Bơi lội, Nhiếp ảnh phim.",
      strengthsSummary:
        "Nữ lãnh đạo năng động, quán quân cuộc thi Khởi nghiệp học sinh THPT TP.HCM, tiếng Anh lưu loát và nền tảng tài chính gia đình cực kỳ vững chắc.",
      annualBudget: "AUD 65,000 - 75,000 / năm (Đủ khả năng tự túc 100%, ưu tiên săn học bổng 20-50%)",
      savingsAmount: "3,5 tỷ VNĐ tại Ngân hàng ACB",
      parentsIncome: "Doanh thu công ty gia đình 45 tỷ/năm; thu nhập ròng của bố mẹ ~220 triệu VNĐ/tháng",
      assetsInfo: "02 Nhà phố Quận 3 & Quận 7 TP.HCM, Kho xưởng tại Bình Dương",
      scholarshipTarget: "Học bổng Melbourne International Undergraduate Scholarship (25% - 50%)",
      pipelineStage: "SUBMITTED",
    },
  });

  await prisma.studentAssignment.createMany({
    data: [
      { studentId: student2.id, userId: counselor2.id, roleLabel: "Tư vấn chính thị trường Úc" },
      { studentId: student2.id, userId: officer1.id, roleLabel: "Xử lý hồ sơ Offer & Visa Úc" },
    ],
  });

  await prisma.academicRecord.createMany({
    data: [
      { studentId: student2.id, levelName: "Lớp 10 & 11 Chuyên Anh", institution: "THPT Chuyên Lê Hồng Phong TP.HCM", year: "2024 - 2026", scoreDetail: "GPA Lớp 10: 8.9 | GPA Lớp 11: 9.2", notes: "Trường nằm trong danh sách tuyển thẳng của ĐH Melbourne" },
      { studentId: student2.id, levelName: "IELTS Academic", institution: "British Council", year: "04/2026", scoreDetail: "7.5 Overall (Không kỹ năng nào dưới 7.0)", notes: "Đạt chuẩn G8 Úc" },
    ],
  });

  await prisma.extracurricular.createMany({
    data: [
      {
        studentId: student2.id,
        title: "Dự án Khởi nghiệp EcoPack Vietnam (Bao bì nông sản phân hủy sinh học)",
        organization: "CLB Khởi nghiệp Trẻ Sài Gòn",
        role: "Founder & Trưởng nhóm Phát triển Kinh doanh",
        category: "Lãnh đạo & Kinh doanh",
        duration: "03/2025 - Hiện tại",
        description: "Thử nghiệm bao bì từ bã mía cho 3 doanh nghiệp xuất khẩu trái cây; gọi vốn thành công 45 triệu đồng quỹ ươm mầm học sinh.",
        proofUrl: "https://drive.google.com/drive/folders/ecopack-pitchdeck",
      },
      {
        studentId: student2.id,
        title: "Giải Tranh biện Tiếng Anh Mở rộng (Saigon Debate Open)",
        organization: "Liên đoàn Tranh biện Học sinh TP.HCM",
        role: "Trưởng Ban Đối ngoại & Tài trợ",
        category: "Lãnh đạo & Truyền thông",
        duration: "2024 - 2026",
        description: "Vận động tài trợ được 120 triệu VNĐ từ 6 đơn vị giáo dục; tổ chức giải đấu quy tụ 300 thí sinh.",
      },
    ],
  });

  await prisma.award.createMany({
    data: [
      {
        studentId: student2.id,
        title: "Giải Nhất Cuộc thi Học sinh với Ý tưởng Khởi nghiệp TP.HCM (SV-STARTUP)",
        level: "Tỉnh/Thành phố",
        issuer: "Sở Giáo dục & Đào tạo TP.HCM",
        year: "2025",
        description: "Đề tài bao bì nông sản thân thiện môi trường EcoPack.",
      },
      {
        studentId: student2.id,
        title: "Giải Ba Học sinh Giỏi Cấp Thành phố môn Tiếng Anh",
        level: "Tỉnh/Thành phố",
        issuer: "Sở Giáo dục & Đào tạo TP.HCM",
        year: "2026",
      },
    ],
  });

  await prisma.application.createMany({
    data: [
      {
        studentId: student2.id,
        schoolId: "sch-unimelb",
        major: "Bachelor of Commerce (Finance & Business Analytics)",
        degreeLevel: "Cử nhân",
        intake: "Feb 2027",
        category: "REACH",
        status: "OFFER_RECEIVED",
        deadline: "2026-10-30",
        scholarshipResult: "Đã nhận Conditional Offer + Đề cử học bổng 25%",
        notes: "Chỉ cần bổ sung bằng tốt nghiệp THPT chính thức để đổi sang Unconditional Offer",
      },
      {
        studentId: student2.id,
        schoolId: "sch-monash",
        major: "Bachelor of Business & Digital Commerce",
        degreeLevel: "Cử nhân",
        intake: "Feb 2027",
        category: "MATCH",
        status: "OFFER_RECEIVED",
        deadline: "2026-10-30",
        scholarshipResult: "Học bổng AUD 10,000/năm",
        notes: "Đã nhận thư mời nhập học chính thức",
      },
    ],
  });

  await prisma.essay.createMany({
    data: [
      {
        studentId: student2.id,
        title: "Bản giải trình Genuine Student Requirement (GSR) & Kế hoạch nghề nghiệp tại Úc",
        essayType: "Statement of Purpose",
        targetSchool: "Bộ Di trú Úc (Home Affairs) & Monash / UniMelb",
        wordCountTarget: 800,
        status: "FINAL",
        externalUrl: "https://docs.google.com/document/d/GSR_BaoTram_Final",
        feedback: "Giải trình rất chặt chẽ về định hướng quay về phát triển chuỗi cung ứng nông sản của gia đình.",
      },
    ],
  });

  await prisma.studentDocument.createMany({
    data: [
      { studentId: student2.id, name: "Hộ chiếu & CCCD + Giấy khai sinh dịch thuật công chứng", category: "Cá nhân", country: "Úc", status: "APPROVED", fileName: "HoChieu_BaoTram.pdf", fileUrl: "/uploads/sample-passport-baotram.pdf" },
      { studentId: student2.id, name: "Học bạ THPT & Chứng chỉ IELTS 7.5", category: "Học thuật", country: "Úc", status: "APPROVED", fileName: "Academic_IELTS75_BaoTram.pdf", fileUrl: "/uploads/sample-ielts-baotram.pdf" },
      { studentId: student2.id, name: "Bản giải trình GSR (Genuine Student Requirement)", category: "Visa", country: "Úc", status: "APPROVED", externalUrl: "https://docs.google.com/document/d/GSR_BaoTram_Final" },
      { studentId: student2.id, name: "Chứng nhận CoE & Bảo hiểm OSHC", category: "Visa", country: "Úc", status: "PENDING_REVIEW", reviewerNote: "Đang chờ gia đình thanh toán học phí kỳ đầu cho ĐH Melbourne để nhận CoE." },
    ],
  });

  await prisma.roadmapTask.createMany({
    data: [
      { studentId: student2.id, title: "Hướng dẫn gia đình chuyển khoản đặt cọc học phí lấy CoE trường UniMelb", category: "Tài chính & Visa", dueDate: "2026-11-29", priority: "HIGH", completed: false, assigneeName: "Phạm Thu Hà" },
      { studentId: student2.id, title: "Đặt lịch khám sức khỏe Visa Úc tại IOM TP.HCM", category: "Tài chính & Visa", dueDate: "2026-12-03", priority: "MEDIUM", completed: false, assigneeName: "Phạm Thu Hà" },
    ],
  });

  // HỌC SINH 3: Đang làm Visa (VISA_PROCESSING) - Hồ sơ Du học Hàn Quốc hệ Quốc tế & Học bổng
  const student3 = await prisma.student.create({
    data: {
      id: "stu-03",
      code: "HS-2026-003",
      fullName: "Lê Phương Thảo",
      gender: "Nữ",
      dob: "2008-11-08",
      email: "phuongthao.le08@gmail.com",
      phone: "0945 667 788",
      address: "Quận Hải Châu, Đà Nẵng",
      passportNumber: "C8129045",
      passportExpiry: "2034-02-15",
      parentName: "Ông Lê Văn Bình & Bà Nguyễn Thị Hương",
      parentPhone: "0914 556 677",
      parentOccupation: "Kinh doanh Khách sạn & Dịch vụ Du lịch tại Đà Nẵng",
      currentSchool: "THPT Phan Châu Trinh - Đà Nẵng",
      currentGrade: "Đã tốt nghiệp THPT (2026)",
      gpa: 8.9,
      gpaScale: "10.0",
      englishTestType: "IELTS",
      englishScore: "7.0",
      standardizedTests: "TOPIK II: Cấp 5 (215/300 điểm)",
      targetCountries: "Hàn Quốc",
      targetIntake: "Spring 2027 (Tháng 03/2027)",
      targetDegree: "Cử nhân (Bachelor)",
      targetMajors: "Media & Communication, International Business",
      careerOrientation:
        "Định hướng phát triển sự nghiệp trong ngành Truyền thông Quốc tế & Quản trị Thương hiệu Văn hóa - Du lịch giữa Hàn Quốc và Việt Nam.",
      skillsAndInterests:
        "• Kỹ năng: Biên phiên dịch Hàn - Anh - Việt, Sản xuất nội dung Video/Podcast, Thiết kế đồ họa Canva/Adobe Premiere.\n• Sở thích: Văn hóa Hàn Quốc, MC song ngữ, Làm vlog giáo dục.",
      strengthsSummary:
        "Sở hữu song bằng ngoại ngữ hiếm (IELTS 7.0 + TOPIK 5), đạt học bổng 50% tại Yonsei University.",
      annualBudget: "$15,000 - $20,000 / năm",
      savingsAmount: "850 triệu VNĐ (Đã mở sổ K-Study tại Ngân hàng Woori Bank)",
      parentsIncome: "90 triệu VNĐ / tháng (Có giấy phép kinh doanh khách sạn & biên lai thuế)",
      assetsInfo: "Khách sạn mini 18 phòng tại Đà Nẵng",
      scholarshipTarget: "Đã đạt học bổng 50% học phí từ Yonsei University",
      pipelineStage: "VISA_PROCESSING",
    },
  });

  await prisma.studentAssignment.createMany({
    data: [
      { studentId: student3.id, userId: counselor2.id, roleLabel: "Tư vấn chính Hàn Quốc" },
      { studentId: student3.id, userId: officer2.id, roleLabel: "Xử lý hợp pháp hóa lãnh sự & Visa D-2" },
    ],
  });

  await prisma.application.createMany({
    data: [
      {
        studentId: student3.id,
        schoolId: "sch-yonsei",
        major: "Culture & Design Management (Underwood International College)",
        degreeLevel: "Cử nhân",
        intake: "Spring 2027",
        category: "REACH",
        status: "VISA_PROCESSING",
        deadline: "2026-10-15",
        scholarshipResult: "Đạt Học bổng 50% học phí + Đã có thư mời (Standard Admission Letter)",
        notes: "Đã nộp hồ sơ xin Visa D-2-2 tại KVAC, đang chờ trả kết quả Visa",
      },
    ],
  });

  await prisma.studentDocument.createMany({
    data: [
      { studentId: student3.id, name: "Học bạ & Bằng tốt nghiệp THPT dán tem tím Lãnh sự quán", category: "Học thuật", country: "Hàn Quốc", status: "APPROVED", fileName: "BangTHPT_TemTim_PhuongThao.pdf", fileUrl: "/uploads/sample-temtim.pdf" },
      { studentId: student3.id, name: "Chứng chỉ TOPIK 5 & IELTS 7.0", category: "Học thuật", country: "Hàn Quốc", status: "APPROVED", fileName: "TOPIK5_IELTS70_PhuongThao.pdf", fileUrl: "/uploads/sample-topik5.pdf" },
      { studentId: student3.id, name: "Giấy xác nhận Sổ tiết kiệm Woori Bank ($20,000)", category: "Tài chính", country: "Hàn Quốc", status: "APPROVED", fileName: "WooriBank_KStudy_PhuongThao.pdf", fileUrl: "/uploads/sample-woori.pdf" },
      { studentId: student3.id, name: "Giấy khám Lao phổi tại BV được ĐSQ Hàn Quốc chỉ định", category: "Visa", country: "Hàn Quốc", status: "APPROVED", fileName: "KhamLaoPhoi_PhuongThao.pdf", fileUrl: "/uploads/sample-medical.pdf" },
    ],
  });

  // HỌC SINH 4: Đã có Visa / Hoàn tất (COMPLETED) - Hồ sơ Du học Đức ngành Kỹ thuật Cơ điện tử
  const student4 = await prisma.student.create({
    data: {
      id: "stu-04",
      code: "HS-2026-004",
      fullName: "Vũ Đức Anh",
      gender: "Nam",
      dob: "2008-02-19",
      email: "ducanh.vu08@gmail.com",
      phone: "0977 334 455",
      address: "Quận Ngô Quyền, Hải Phòng",
      passportNumber: "C6500912",
      passportExpiry: "2033-05-12",
      parentName: "Ông Vũ Trọng Nghĩa & Bà Phạm Thị Lan",
      parentPhone: "0913 229 988",
      parentOccupation: "Kỹ sư Đóng tàu & Giáo viên THPT",
      currentSchool: "THPT Chuyên Trần Phú - Hải Phòng",
      currentGrade: "Đã tốt nghiệp THPT",
      gpa: 9.0,
      gpaScale: "10.0",
      englishTestType: "IELTS",
      englishScore: "7.0",
      standardizedTests: "Goethe-Zertifikat B2 | TestAS: 118/130 (Mô-đun Kỹ thuật)",
      targetCountries: "Đức",
      targetIntake: "Winter Semester 2026/2027",
      targetDegree: "Cử nhân Kỹ thuật (B.Sc.)",
      targetMajors: "Mechanical Engineering & Mechatronics (Cơ điện tử)",
      careerOrientation:
        "Định hướng trở thành Kỹ sư Tự động hóa & Cơ điện tử làm việc tại các tập đoàn công nghiệp ô tô tại Munich (BMW / Siemens).",
      skillsAndInterests:
        "• Kỹ năng: Thiết kế CAD SolidWorks, Lập trình vi điều khiển Arduino/PLC, Tiếng Đức B2 & Tiếng Anh IELTS 7.0.\n• Sở thích: Lắp ráp mô hình cơ khí, Bóng đá.",
      strengthsSummary:
        "Đã hoàn tất thẩm tra APS, điểm TestAS thuộc nhóm Top 5% khối Kỹ thuật, đã nhận Visa du học Đức.",
      annualBudget: "EUR 18,000 / năm",
      savingsAmount: "Đã mở Tài khoản Phong tỏa (Sperrkonto) EUR 11,904 tại Expatrio",
      parentsIncome: "65 triệu VNĐ / tháng",
      assetsInfo: "Nhà riêng tại Hải Phòng & Sổ tiết kiệm dự phòng 600 triệu VNĐ",
      scholarshipTarget: "Học bổng DAAD & Miễn giảm học phí bang Bavaria",
      pipelineStage: "COMPLETED",
    },
  });

  await prisma.studentAssignment.createMany({
    data: [
      { studentId: student4.id, userId: counselor1.id, roleLabel: "Tư vấn định hướng STEM" },
      { studentId: student4.id, userId: officer1.id, roleLabel: "Phụ trách APS & Visa Đức" },
    ],
  });

  await prisma.application.createMany({
    data: [
      {
        studentId: student4.id,
        schoolId: "sch-tum",
        major: "B.Sc. Mechanical Engineering / Mechatronics",
        degreeLevel: "Cử nhân",
        intake: "Winter 2026",
        category: "REACH",
        status: "COMPLETED",
        deadline: "2026-07-15",
        scholarshipResult: "Đã trúng tuyển & Đã cấp Visa Quốc gia Đức (D-Visa)",
        notes: "Học sinh đã hoàn tất thủ tục Pre-departure và đặt vé máy bay đi Munich.",
      },
    ],
  });

  console.log("✅ Khởi tạo dữ liệu mẫu hoàn tất!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
