import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import SignedOutHeader from "@/components/signed-out-header";
import QueryProvider from "@/components/providers/query-provider";
import "./globals.css";

const geistSans = Space_Grotesk({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Link Shortener | Branded short links with analytics",
  description: "Create memorable short links, track performance, and grow campaigns with real-time analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: "dark",
        variables: {
          colorBackground: "#0b1324",
          colorInputBackground: "#0a1a2a",
          colorInputText: "#e2e8f0",
          colorText: "#f1f5f9",
          colorTextSecondary: "#cbd5f5",
          colorTextTertiary: "#94a3b8",
          colorPrimary: "#22d3ee",
          colorDanger: "#ff6b6b",
          colorSuccess: "#34d399",
          colorWarning: "#f59e0b",
          colorNeutral: "#64748b",
          colorShimmer: "#0a1a2a",
          borderRadius: "0.9rem",
        },
        elements: {
          rootBox: "rounded-[1.35rem]",
          card: "rounded-[1.35rem] bg-slate-950/90 border border-cyan-500/20 shadow-[0_28px_70px_-40px_rgba(34,211,238,0.6)]",
          formFieldLabel: "text-slate-200 font-medium",
          formFieldInput:
            "bg-slate-950 border-slate-800 text-slate-50 focus:ring-cyan-400",
          buttons: {
            primaryButton:
              "bg-cyan-400 hover:bg-cyan-300 text-slate-900 font-semibold",
            primaryButtonHover: "bg-cyan-300",
          },
          formButtonPrimary:
            "bg-cyan-400 hover:bg-cyan-300 text-slate-900 font-semibold rounded-xl",
          socialButtonsBlockButton:
            "bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-200",
          socialButtonsBlockButtonText: "text-slate-200 font-medium",
          socialButtonsBlockButtonArrow: "text-slate-400",
          socialButtonsBlockButtonIconButton:
            "text-slate-200 hover:text-slate-100",
          oauthTryAnotherMethodButton: "text-cyan-400 hover:text-cyan-300",
          footerActionLink: "text-cyan-400 hover:text-cyan-300",
          identityPreviewText: "text-slate-300",
          identityPreviewEditButton: "text-cyan-400 hover:text-cyan-300",
          alert: "bg-slate-950 border-slate-800 text-slate-200",
          userButtonBox: "text-slate-100",
          userButtonTrigger: "text-slate-100 hover:text-slate-50",
          userMenu: "bg-slate-950 border-slate-800 text-slate-200",
          userMenuAction: "text-slate-200 bg-slate-950 hover:bg-slate-800",
          userMenuActionIcon: "text-slate-400",
          userMenuActionButton: "text-slate-200",
          menuList: "bg-slate-950 border-slate-800",
          menuAction: "text-slate-200 bg-slate-950 hover:bg-slate-800",
          menuActionIcon: "text-slate-400",
          menuButton: "text-slate-200",
          dividerLine: "bg-slate-800",
          headerTitle: "text-slate-100",
          headerSubtitle: "text-slate-400",
          link: "text-cyan-400 hover:text-cyan-300",
        },
      }}
    >
      <html lang="en" className="dark" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <QueryProvider>
            <SignedOutHeader />
            {children}
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
