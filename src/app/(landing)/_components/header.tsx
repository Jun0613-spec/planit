import Image from "next/image";
import Link from "next/link";
import React from "react";

import { Button } from "../../../components/ui/button";

import { ModeToggle } from "../../../components/mode-toggle";

const Header = () => {
  return (
    <header className="mx-auto max-w-screen-2xl p-4 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Image src="/logo.png" alt="logo" width={40} height={40} />
        <p className="text-2xl font-bold text-gray-800 dark:text-white">
          Planit
        </p>
      </div>
      <div className="flex justify-center items-center gap-2">
        <ModeToggle />
        <Button asChild variant="primary">
          <Link href="/sign-up">Get it Free</Link>
        </Button>
      </div>
    </header>
  );
};

export default Header;
