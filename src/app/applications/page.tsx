import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { statusVariant } from "@/lib/status";

export const dynamic = "force-dynamic";

export default async function ApplicationsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "CANDIDATE") redirect("/dashboard");

  const apps = await db.application.findMany({
    where: { userId: session.user.id },
    include: {
      job: { select: { title: true, owner: { select: { companyName: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="py-10">
      <h1 className="mb-6 text-2xl font-bold">My Applications</h1>
      {apps.length === 0 && (
        <p className="text-muted-foreground">
          No applications yet.{" "}
          <Link href="/jobs" className="underline">Browse jobs</Link>.
        </p>
      )}
      <div className="grid gap-4">
        {apps.map((app) => (
          <Card key={app.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle>
                    <Link href={`/jobs/${app.jobId}`} className="hover:underline">
                      {app.job.title}
                    </Link>
                  </CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {app.job.owner.companyName} · Applied{" "}
                    {app.createdAt.toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <Badge variant={statusVariant(app.status)}>{app.status}</Badge>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
