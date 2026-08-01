"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { registerUser } from "@/server/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const [state, action, pending] = useActionState(registerUser, undefined);
  const [role, setRole] = useState("CANDIDATE");

  return (
    <div className="mx-auto max-w-sm space-y-6 py-16">
      <h1 className="text-2xl font-bold">Register</h1>
      <form action={action} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" minLength={8} required />
        </div>
        <div className="space-y-2">
          <Label>I am a</Label>
          <div className="flex gap-2">
            <Button type="button" variant={role === "CANDIDATE" ? "default" : "outline"}
              onClick={() => setRole("CANDIDATE")}>Candidate</Button>
            <Button type="button" variant={role === "COMPANY" ? "default" : "outline"}
              onClick={() => setRole("COMPANY")}>Company</Button>
          </div>
          <input type="hidden" name="role" value={role} />
        </div>
        {role === "COMPANY" && (
          <div className="space-y-2">
            <Label htmlFor="companyName">Company name</Label>
            <Input id="companyName" name="companyName" required />
          </div>
        )}
        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Registering..." : "Register"}
        </Button>
      </form>
      <p className="text-sm text-muted-foreground">
        Already have an account? <Link href="/login" className="underline">Login</Link>
      </p>
    </div>
  );
}
