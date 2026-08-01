import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
const FEATURES = [
  { title: "For companies", desc: "Post jobs and manage applicants in one pipeline — applied, interview, hired." },
  { title: "For candidates", desc: "Find open roles and apply with your CV. Track your application status live." },
  { title: "Simple by design", desc: "No spreadsheets, no email chaos. One clean dashboard." },
];

export default function HomePage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Hire faster. Get hired faster.
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          JobFlow is a simple job board and applicant tracker. Companies post,
          candidates apply, everyone stays in the loop.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button size="lg" render={<Link href="/register" />}>Get started</Button>
          <Button size="lg" variant="outline" render={<Link href="/jobs" />}>Browse jobs</Button>
        </div>
      </div>
      <div className="mt-16 grid gap-4 md:grid-cols-3">
        {FEATURES.map((f) => (
          <Card key={f.title}>
            <CardHeader>
              <CardTitle className="text-base">{f.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-16 text-center">
        <Badge variant="secondary">Built with Next.js · PostgreSQL · Prisma</Badge>
      </div>
    </div>
  );
}
