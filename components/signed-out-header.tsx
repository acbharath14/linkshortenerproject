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
    <header className="border-b border-border">
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-bold">Link Shortener</h1>
        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="outline">Login</Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button>Sign up</Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link
              href="/dashboard"
              className="text-sm font-medium underline-offset-4 hover:underline"
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
