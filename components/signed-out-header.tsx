"use client";

import Link from "next/link";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function SignedOutHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="h-2.5 w-2.5 rounded-full bg-primary" />
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Link Shortener
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="outline" className="border-primary/30 bg-background/80">
                Login
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button className="shadow-[0_18px_40px_-20px] shadow-primary/60">
                Sign up
              </Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-foreground/80 underline-offset-4 hover:text-foreground hover:underline"
            >
              Go to Dashboard
            </Link>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
