import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { closeJob } from "@/server/actions";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "COMPANY") redirect("/jobs");

  const jobs = await db.job.findMany({
    where: { ownerId: session.user.id },
    include: { _count: { select: { applications: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Jobs</h1>
        <Button render={<Link href="/dashboard/jobs/new" />}>Post a Job</Button>
      </div>

      {jobs.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No jobs yet — post your first job.
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {jobs.map((job) => (
          <Card key={job.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle>
                    <Link href={`/dashboard/jobs/${job.id}`} className="hover:underline">
                      {job.title}
                    </Link>
                  </CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {job.location} · {job._count.applications} applicant(s)
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={job.status === "OPEN" ? "default" : "secondary"}>
                    {job.status}
                  </Badge>
                  <form action={closeJob}>
                    <input type="hidden" name="id" value={job.id} />
                    <Button variant="outline" size="sm" type="submit">
                      {job.status === "OPEN" ? "Close" : "Reopen"}
                    </Button>
                  </form>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
