import React from "react";
import Image from "next/image";
import Link from "next/link";

import { Separator } from "@/components/ui/separator";

import Navigation from "./navigation";
import WorkspaceSwitcher from "./workspace-switcher";
import ProjectList from "./project-list";

const Sidebar = () => {
  return (
    <aside className="h-full border-r dark:border-neutral-600 p-5 w-full">
      <div className="flex items-center space-x-3 mb-6">
        <Link
          href={`/`}
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
        >
          <Image src="/logo.png" alt="Planit logo" width={40} height={40} />
          <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Planit
          </span>
        </Link>
      </div>
      <Separator className="my-4" />
      <WorkspaceSwitcher />
      <Separator className="my-4" />
      <Navigation />
      <Separator className="my-4" />
      <ProjectList />
    </aside>
  );
};

export default Sidebar;
