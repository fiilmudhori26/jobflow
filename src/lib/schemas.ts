import { z } from "zod";

const optionalInt = z.preprocess(
  (v) => (v === "" || v === null ? undefined : v),
  z.coerce.number().int().min(0).optional()
);

export const registerSchema = z.object({
  name: z.string().min(2).max(60),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["CANDIDATE", "COMPANY"]),
  companyName: z.string().max(100).optional(),
});

export const jobSchema = z.object({
  title: z.string().min(3).max(100),
  location: z.string().min(2).max(100),
  type: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "REMOTE"]),
  salaryMin: optionalInt,
  salaryMax: optionalInt,
  description: z.string().min(20),
});
