import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { updateApplicationStatus } from "@/server/actions";
import { statusVariant } from "@/lib/status";

export const dynamic = "force-dynamic";

const STATUSES = ["APPLIED", "REVIEWING", "INTERVIEW", "HIRED", "REJECTED"];

export default async function JobApplicantsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "COMPANY") redirect("/jobs");

  const job = await db.job.findUnique({
    where: { id },
    include: { applications: { include: { user: true }, orderBy: { createdAt: "desc" } } },
  });
  if (!job || job.ownerId !== session.user.id) notFound();

  return (
    <div className="py-10">
      <h1 className="mb-2 text-2xl font-bold">{job.title}</h1>
      <p className="mb-6 text-muted-foreground">
        {job.applications.length} applicant(s)
      </p>

      {job.applications.length === 0 ? (
        <p className="text-muted-foreground">No applicants yet.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Candidate</TableHead>
              <TableHead>Applied</TableHead>
              <TableHead>CV</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {job.applications.map((app) => (
              <TableRow key={app.id}>
                <TableCell>
                  <div className="font-medium">{app.user.name}</div>
                  <div className="text-sm text-muted-foreground">{app.user.email}</div>
                </TableCell>
                <TableCell className="text-sm">
                  {app.createdAt.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                  })}
                </TableCell>
                <TableCell>
                  <a href={app.cvUrl} target="_blank" rel="noopener noreferrer" className="text-sm underline">
                    View CV
                  </a>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge variant={statusVariant(app.status)}>{app.status}</Badge>
                    <form action={updateApplicationStatus}>
                      <input type="hidden" name="id" value={app.id} />
                      <select
                        name="status"
                        defaultValue={app.status}
                        className="h-7 rounded-md border bg-transparent px-2 text-xs"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <Button type="submit" size="sm" className="ml-2">Update</Button>
                    </form>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
