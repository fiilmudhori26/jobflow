import { auth } from "@/auth";
import { db } from "@/lib/db";

export const requireUser = async () => {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user;
};

export const requireRole = async (role: "CANDIDATE" | "COMPANY") => {
  const user = await requireUser();
  if (user.role !== role) throw new Error("Forbidden");
  return user;
};

export const getDbUser = async (id: string) =>
  db.user.findUnique({ where: { id } });
