import { cookies } from "next/headers";
import { prisma } from "./prisma";

export const SESSION_COOKIE_NAME = "edupath_session_user_id";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get(SESSION_COOKIE_NAME)?.value || "user-admin";

  let user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    user = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    });
  }

  if (!user) {
    user = await prisma.user.findFirst();
  }

  return user;
}

export async function getAllUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: "asc" },
  });
}

export function canUserAccessStudent(
  user: { id: string; role: string },
  assignments: { userId: string }[]
) {
  if (user.role === "ADMIN") return true;
  return assignments.some((a) => a.userId === user.id);
}
