import { ModeToggle } from "@/components/mode-toggle";
import UserButton from "@/components/user-button";
import Image from "next/image";
import Link from "next/link";
import React, { ReactNode } from "react";

const StandaloneLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="min-h-screen bg-white dark:bg-neutral-900">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center justify-center">
            <Link href="/">
              <Image src="/logo.png" alt="logo" width={40} height={40} />
            </Link>
          </div>
          <div className="flex justify-center items-center gap-2">
            <ModeToggle />
            <UserButton />
          </div>
        </nav>
        <div className="flex flex-col items-center justify-center pt-4 md:pt-14">
          {children}
        </div>
      </div>
    </main>
  );
};

export default StandaloneLayout;
