import Link from "next/link";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatSalary } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function JobsPage() {
  const jobs = await db.job.findMany({
    where: { status: "OPEN" },
    include: { owner: { select: { companyName: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="py-10">
      <h1 className="mb-6 text-2xl font-bold">Open Positions</h1>
      {jobs.length === 0 && (
        <p className="text-muted-foreground">No jobs yet — check back soon.</p>
      )}
      <div className="grid gap-4">
        {jobs.map((job) => (
          <Card key={job.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle>
                    <Link href={`/jobs/${job.id}`} className="hover:underline">
                      {job.title}
                    </Link>
                  </CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {job.owner.companyName} · {job.location}
                  </p>
                </div>
                <Badge variant="secondary">{job.type.replace("_", " ")}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {job.salaryMin ? formatSalary(job.salaryMin) : ""}
                {job.salaryMin && job.salaryMax ? " – " : ""}
                {job.salaryMax ? formatSalary(job.salaryMax) : ""}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
