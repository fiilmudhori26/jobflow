"use client";

import { useActionState } from "react";
import { createJob, updateJob } from "@/server/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TYPES = ["FULL_TIME", "PART_TIME", "CONTRACT", "REMOTE"] as const;

export default function JobForm({ job }: { job?: { id: string; title: string; location: string; type: string; salaryMin: number | null; salaryMax: number | null; description: string } }) {
  const [state, action, pending] = useActionState(job ? updateJob : createJob, undefined);
  return (
    <form action={action} className="space-y-4">
      {job && <input type="hidden" name="id" value={job.id} />}
      <div className="space-y-2">
        <Label htmlFor="title">Job title</Label>
        <Input id="title" name="title" defaultValue={job?.title} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" defaultValue={job?.location} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select name="type" defaultValue={job?.type ?? "FULL_TIME"}>
            <SelectTrigger id="type"><SelectValue /></SelectTrigger>
            <SelectContent>
              {TYPES.map((t) => (
                <SelectItem key={t} value={t}>{t.replace("_", " ")}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="salaryMin">Salary min (Rp)</Label>
          <Input id="salaryMin" name="salaryMin" type="number" defaultValue={job?.salaryMin ?? ""} placeholder="6000000" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="salaryMax">Salary max (Rp)</Label>
          <Input id="salaryMax" name="salaryMax" type="number" defaultValue={job?.salaryMax ?? ""} placeholder="10000000" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" rows={6} defaultValue={job?.description} required />
      </div>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : job ? "Save changes" : "Post job"}
      </Button>
    </form>
  );
}
