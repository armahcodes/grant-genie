import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./reduced-motion.css";
import "./animations.css";
import { Provider } from "@/components/ui/provider";
import { QueryProvider } from "@/lib/providers/QueryProvider";
import { ToastProvider } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { StackProvider } from "@stackframe/stack";
import { stackServerApp } from "@/lib/stack";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://headspacegenie.ai'),
  title: {
    default: "HeadspaceGenie.ai — Headspace for humans who lead",
    template: "%s | HeadspaceGenie.ai",
  },
  description: "The AI Ecosystem for Mission-Driven Leaders. Built to give leaders back their headspace. AI that remembers your mission and automates with heart.",
  keywords: ["nonprofit", "grant writing", "AI assistant", "fundraising", "donor management", "mission-driven", "nonprofit software"],
  authors: [{ name: "HeadspaceGenie" }],
  creator: "HeadspaceGenie",
  publisher: "HeadspaceGenie",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "HeadspaceGenie.ai — Headspace for humans who lead",
    description: "The AI Ecosystem for Mission-Driven Leaders. Built to give leaders back their headspace. AI that remembers your mission and automates with heart.",
    siteName: "HeadspaceGenie",
  },
  twitter: {
    card: "summary_large_image",
    title: "HeadspaceGenie.ai — Headspace for humans who lead",
    description: "The AI Ecosystem for Mission-Driven Leaders. Built to give leaders back their headspace. AI that remembers your mission and automates with heart.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add when available:
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <StackProvider app={stackServerApp}>
            <QueryProvider>
              <Provider>
                <ErrorBoundary>
                  <ToastProvider>
                    {children}
                  </ToastProvider>
                </ErrorBoundary>
              </Provider>
            </QueryProvider>
          </StackProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
