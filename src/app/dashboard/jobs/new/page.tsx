import { redirect } from "next/navigation";
import { auth } from "@/auth";
import JobForm from "@/components/job-form";

export default async function NewJobPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "COMPANY") redirect("/jobs");
  return (
    <div className="mx-auto max-w-2xl py-10">
      <h1 className="mb-6 text-2xl font-bold">Post a Job</h1>
      <JobForm />
    </div>
  );
}
