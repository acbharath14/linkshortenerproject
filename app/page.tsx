'use client';

import { useAuth, SignUpButton, SignInButton } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { Link2, Zap, BarChart3, Shield, Globe, Smartphone, Sparkles } from "lucide-react";
import { useEffect } from 'react';
import { Button } from "@/components/ui/button";

export default function Home() {
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      redirect('/dashboard');
    }
  }, [isLoaded, isSignedIn]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-20 md:py-28">
        <div className="aurora-bg absolute inset-0" aria-hidden="true" />
        <div className="mx-auto max-w-6xl">
          <div className="relative grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-primary">
                <Sparkles className="h-4 w-4" />
                Smarter links, sharper insights
              </div>
              <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-6xl lg:text-7xl">
                Links that feel
                <span className="block text-primary">polished, branded, and fast.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg text-muted-foreground md:text-xl">
                Create short, memorable links and watch performance in real time. Built for
                product launches, content campaigns, and everyday sharing.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <SignUpButton mode="modal">
                  <Button size="lg" className="shadow-[0_18px_40px_-20px] shadow-primary/60">
                    Start Free
                  </Button>
                </SignUpButton>
                <SignInButton mode="modal">
                  <Button size="lg" variant="outline" className="border-primary/30 bg-background/80">
                    See Live Demo
                  </Button>
                </SignInButton>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  99.9% uptime
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                  Real-time click analytics
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-sky-500" />
                  Custom aliases
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="floating-card rounded-3xl border border-border/70 bg-card/90 p-6 shadow-[0_20px_80px_-30px_rgba(15,23,42,0.6)]">
                <div className="flex items-center justify-between text-sm">
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-600">
                    Live
                  </span>
                  <span className="text-muted-foreground">Last 24 hours</span>
                </div>
                <div className="mt-6 space-y-5">
                  <div>
                    <p className="text-sm text-muted-foreground">Short link</p>
                    <div className="mt-2 rounded-2xl border border-border bg-background/70 p-3 font-medium">
                      linksh.rt/launchkit
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Clicks</p>
                    <div className="mt-2 flex items-baseline gap-3">
                      <span className="text-3xl font-semibold">2,418</span>
                      <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs text-emerald-600">
                        +18.4%
                      </span>
                    </div>
                  </div>
                  <div className="grid gap-4 rounded-2xl bg-muted/60 p-4 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Top source</span>
                      <span className="font-medium">LinkedIn</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Avg. daily</span>
                      <span className="font-medium">326 clicks</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="glow-orb" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/40 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Why Choose Our Link Shortener?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Everything you need to manage and optimize your links
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="feature-card rounded-2xl border bg-card p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Link2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Instant Short Links</h3>
              <p className="text-muted-foreground">
                Generate short, clean URLs instantly. Perfect for social media, 
                emails, and anywhere you need a compact link.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="feature-card rounded-2xl border bg-card p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Experience blazing-fast redirects with our optimized infrastructure. 
                Your users won't even notice the redirect.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="feature-card rounded-2xl border bg-card p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Analytics & Insights</h3>
              <p className="text-muted-foreground">
                Track clicks, analyze traffic sources, and understand your audience 
                with detailed analytics and reports.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="feature-card rounded-2xl border bg-card p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Secure & Reliable</h3>
              <p className="text-muted-foreground">
                Your links are protected with industry-standard security. We ensure 
                99.9% uptime so your links always work.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="feature-card rounded-2xl border bg-card p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Custom Domains</h3>
              <p className="text-muted-foreground">
                Use your own branded domain for shortened links. Build trust and 
                strengthen your brand identity.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="feature-card rounded-2xl border bg-card p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Smartphone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Mobile Optimized</h3>
              <p className="text-muted-foreground">
                Manage your links on the go. Our responsive design works perfectly 
                on all devices, from desktop to mobile.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-12">
        <div className="mx-auto max-w-6xl text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Link Shortener. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
