"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { registerSchema, jobSchema } from "@/lib/schemas";
import { requireRole } from "@/server/auth-helpers";

type ActionState = { error?: string } | undefined;

export async function registerUser(_prev: ActionState, formData: FormData) {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
    companyName: formData.get("companyName") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { name, email, password, role, companyName } = parsed.data;
  if (role === "COMPANY" && !companyName)
    return { error: "Company name required" };

  const exists = await db.user.findUnique({ where: { email } });
  if (exists) return { error: "Email already registered" };

  await db.user.create({
    data: {
      name,
      email,
      passwordHash: await bcrypt.hash(password, 10),
      role,
      companyName,
    },
  });
  redirect("/login?registered=1");
}

export async function createJob(_prev: ActionState, formData: FormData) {
  await requireRole("COMPANY");
  const parsed = jobSchema.safeParse({
    title: formData.get("title"),
    location: formData.get("location"),
    type: formData.get("type"),
    salaryMin: formData.get("salaryMin"),
    salaryMax: formData.get("salaryMax"),
    description: formData.get("description"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const user = await requireRole("COMPANY");
  await db.job.create({ data: { ...parsed.data, ownerId: user.id! } });
  redirect("/dashboard");
}

export async function updateJob(_prev: ActionState, formData: FormData) {
  const user = await requireRole("COMPANY");
  const id = String(formData.get("id") ?? "");
  const parsed = jobSchema.safeParse({
    title: formData.get("title"),
    location: formData.get("location"),
    type: formData.get("type"),
    salaryMin: formData.get("salaryMin"),
    salaryMax: formData.get("salaryMax"),
    description: formData.get("description"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const job = await db.job.findUnique({ where: { id } });
  if (!job || job.ownerId !== user.id) return { error: "Not your job" };
  await db.job.update({ where: { id }, data: parsed.data });
  redirect("/dashboard");
}

export async function closeJob(formData: FormData) {
  const user = await requireRole("COMPANY");
  const id = String(formData.get("id") ?? "");
  const job = await db.job.findUnique({ where: { id } });
  if (!job || job.ownerId !== user.id) return;
  await db.job.update({
    where: { id },
    data: { status: job.status === "OPEN" ? "CLOSED" : "OPEN" },
  });
}
