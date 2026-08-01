import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatSalary } from "@/lib/format";
import { ApplyForm } from "@/components/apply-form";

export const dynamic = "force-dynamic";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await db.job.findUnique({
    where: { id },
    include: { owner: { select: { companyName: true } } },
  });
  if (!job) notFound();

  const session = await auth();
  const alreadyApplied =
    session?.user?.id != null &&
    (await db.application.findUnique({
      where: { jobId_userId: { jobId: job.id, userId: session.user.id } },
    }));

  const salary =
    job.salaryMin && job.salaryMax
      ? `${formatSalary(job.salaryMin)} – ${formatSalary(job.salaryMax)}`
      : job.salaryMin
        ? `${formatSalary(job.salaryMin)}+`
        : job.salaryMax
          ? `up to ${formatSalary(job.salaryMax)}`
          : "Not specified";

  return (
    <div className="mx-auto max-w-3xl py-10">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">{job.title}</CardTitle>
              <p className="mt-1 text-muted-foreground">
                {job.owner.companyName} · {job.location} · {salary}
              </p>
            </div>
            <Badge variant={job.status === "OPEN" ? "default" : "secondary"}>
              {job.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="whitespace-pre-wrap">{job.description}</div>
          {job.status === "OPEN" && session?.user?.role === "CANDIDATE" && (
            alreadyApplied ? (
              <p className="text-sm text-muted-foreground">
                You already applied. Check your{" "}
                <Link href="/applications" className="underline">applications</Link>.
              </p>
            ) : (
              <ApplyForm jobId={job.id} />
            )
          )}
          {job.status === "OPEN" && !session?.user && (
            <Button render={<Link href={`/login?next=/jobs/${job.id}`} />}>
              Login to apply
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
