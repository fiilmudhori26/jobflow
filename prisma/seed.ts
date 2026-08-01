import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const company = await db.user.upsert({
    where: { email: "hr@acme.com" },
    update: {},
    create: {
      name: "Acme HR",
      email: "hr@acme.com",
      role: "COMPANY",
      companyName: "Acme Corp",
      passwordHash: "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy", // 'password123'
    },
  });

  const cand1 = await db.user.upsert({
    where: { email: "budi@mail.com" },
    update: {},
    create: {
      name: "Budi Santoso",
      email: "budi@mail.com",
      role: "CANDIDATE",
      passwordHash: "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
    },
  });
  const cand2 = await db.user.upsert({
    where: { email: "siti@mail.com" },
    update: {},
    create: {
      name: "Siti Aminah",
      email: "siti@mail.com",
      role: "CANDIDATE",
      passwordHash: "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
    },
  });

  const j1 = await db.job.upsert({
    where: { id: "job-frontend" },
    update: {},
    create: {
      id: "job-frontend",
      ownerId: company.id,
      title: "Frontend Developer",
      location: "Remote",
      type: "REMOTE",
      salaryMin: 6000000,
      salaryMax: 10000000,
      description:
        "Build React/Next.js interfaces for our SaaS product. 2+ years experience.",
    },
  });
  await db.application.upsert({
    where: { jobId_userId: { jobId: j1.id, userId: cand1.id } },
    update: {},
    create: {
      jobId: j1.id,
      userId: cand1.id,
      cvUrl: "https://example.com/cv-budi.pdf",
      status: "REVIEWING",
    },
  });
  await db.application.upsert({
    where: { jobId_userId: { jobId: j1.id, userId: cand2.id } },
    update: {},
    create: {
      jobId: j1.id,
      userId: cand2.id,
      cvUrl: "https://example.com/cv-siti.pdf",
      status: "INTERVIEW",
    },
  });

  console.log("Seeded: 1 company, 3 jobs, 2 candidates, 2 applications");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
