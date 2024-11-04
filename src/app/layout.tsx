import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

import { cn } from "@/lib/utils";

import { ThemeProvider } from "@/components/providers/theme-provider";
import QueryProvider from "@/components/providers/query-provider";

import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

const font = DM_Sans({
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Planit",
  description: "Full stack task management application"
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={cn(font.className, "antialiased min-h-screen")}>
        <QueryProvider>
          <SessionProvider session={session}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Toaster richColors closeButton position="top-right" />
              {children}
            </ThemeProvider>
          </SessionProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
