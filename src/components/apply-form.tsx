"use client";

import { useActionState } from "react";
import { applyToJob } from "@/server/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ApplyForm({ jobId }: { jobId: string }) {
  const [state, action, pending] = useActionState(applyToJob, undefined);
  return (
    <form action={action} className="space-y-4 rounded-lg border p-4">
      <input type="hidden" name="jobId" value={jobId} />
      <h3 className="font-semibold">Apply</h3>
      <div className="space-y-2">
        <Label htmlFor="cvUrl">CV link</Label>
        <Input
          id="cvUrl"
          name="cvUrl"
          type="url"
          placeholder="https://drive.google.com/your-cv.pdf"
          required
        />
        <p className="text-xs text-muted-foreground">
          Link to your CV (Google Drive, Dropbox, etc.)
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="coverLetter">Cover letter (optional)</Label>
        <Textarea id="coverLetter" name="coverLetter" rows={4} />
      </div>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "Applying..." : "Submit application"}
      </Button>
    </form>
  );
}
