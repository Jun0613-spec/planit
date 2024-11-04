"use client";

import React from "react";
import { usePathname } from "next/navigation";

import { ModeToggle } from "@/components/mode-toggle";
import UserButton from "@/components/user-button";

import MobileSidebar from "./sidebar/mobile-sidebar";

const Navbar = () => {
  const pathname = usePathname();

  const getTitleAndDescription = () => {
    if (pathname.includes("/tasks"))
      return {
        title: "My Tasks",
        description: "Track and organize your tasks"
      };
    else if (pathname.includes("/members"))
      return {
        title: "Members",
        description: "View and manage team members"
      };
    else if (pathname.includes("/settings"))
      return {
        title: "Settings",
        description: "Manage your workspace"
      };
    else if (pathname.includes("/projects"))
      return {
        title: "My Project",
        description: "View tasks of your project here"
      };
    else
      return {
        title: "Planit",
        description: "Manage your projects and tasks efficiently"
      };
  };

  const { title, description } = getTitleAndDescription();

  return (
    <nav className="pt-4 px-6 flex items-center justify-between">
      <div className="flex-col hidden lg:flex">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <MobileSidebar />
      <div className="flex items-center justify-center gap-4">
        <ModeToggle />

        <UserButton />
      </div>
    </nav>
  );
};

export default Navbar;
