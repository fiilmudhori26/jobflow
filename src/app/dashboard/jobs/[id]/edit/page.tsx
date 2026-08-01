import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import JobForm from "@/components/job-form";

export const dynamic = "force-dynamic";

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "COMPANY") redirect("/jobs");

  const job = await db.job.findUnique({ where: { id } });
  if (!job || job.ownerId !== session.user.id) notFound();

  return (
    <div className="mx-auto max-w-2xl py-10">
      <h1 className="mb-6 text-2xl font-bold">Edit Job</h1>
      <JobForm
        job={{
          id: job.id,
          title: job.title,
          location: job.location,
          type: job.type,
          salaryMin: job.salaryMin,
          salaryMax: job.salaryMax,
          description: job.description,
        }}
      />
    </div>
  );
}
