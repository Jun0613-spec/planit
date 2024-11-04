"use client";

import React, { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const pathname = usePathname();
  const isSignIn = pathname === "/sign-in";

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-900">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center justify-center">
            <Link href="/landing">
              <Image src="/logo.png" alt="logo" width={40} height={40} />
            </Link>
          </div>
          <Button asChild variant="secondary">
            <Link href={isSignIn ? "/sign-up" : "sign-in"}>
              {isSignIn ? "Sign up" : "Sign in"}
            </Link>
          </Button>
        </nav>
        <div className="flex flex-col items-center justify-center pt-4 md:pt-14">
          {children}
        </div>
      </div>
    </main>
  );
};

export default AuthLayout;
