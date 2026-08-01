import Link from "next/link";
import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";

export default async function Navbar() {
  const session = await auth();
  return (
    <header className="border-b">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="font-bold">JobFlow</Link>
        <nav className="flex items-center gap-3">
          <Link href="/jobs" className="text-sm hover:underline">Jobs</Link>
          {session?.user ? (
            <>
              {session.user.role === "COMPANY" && (
                <Link href="/dashboard" className="text-sm hover:underline">Dashboard</Link>
              )}
              {session.user.role === "CANDIDATE" && (
                <Link href="/applications" className="text-sm hover:underline">Applications</Link>
              )}
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <Button variant="outline" size="sm" type="submit">
                  Logout ({session.user.name?.split(" ")[0]})
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm hover:underline">Login</Link>
              <Button size="sm" render={<Link href="/register" />}>Register</Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
