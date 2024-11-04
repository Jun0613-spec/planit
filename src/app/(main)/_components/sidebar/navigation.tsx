"use client";

import React from "react";
import { GoCheckCircle, GoCheckCircleFill } from "react-icons/go";
import { MdOutlineSpaceDashboard, MdSpaceDashboard } from "react-icons/md";
import { IoSettings, IoSettingsOutline } from "react-icons/io5";
import { PiUsersFill, PiUsers } from "react-icons/pi";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { useWorkspaceId } from "@/hooks/workspaces/use-workspace-id";

const routes = [
  {
    label: "Dashboard",
    href: "",
    icon: MdOutlineSpaceDashboard,
    activeIcon: MdSpaceDashboard
  },
  {
    label: "My Tasks",
    href: "/tasks",
    icon: GoCheckCircle,
    activeIcon: GoCheckCircleFill
  },

  {
    label: "Members",
    href: "/members",
    icon: PiUsers,
    activeIcon: PiUsersFill
  },
  {
    label: "Settings",
    href: "/settings",
    icon: IoSettingsOutline,
    activeIcon: IoSettings
  }
];

const Navigation = () => {
  const workspaceId = useWorkspaceId();
  const pathname = usePathname();

  return (
    <ul className="flex flex-col">
      {routes.map((item) => {
        const fullHref = `/workspaces/${workspaceId}${item.href}`;
        const isActive = pathname === fullHref;
        const Icon = isActive ? item.activeIcon : item.icon;

        return (
          <Link key={item.href} href={fullHref}>
            <div
              className={cn(
                "flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:text-neutral-400 transition text-neutral-600 dark:text-neutral-300 dark:hover:text-neutral-100",
                isActive &&
                  "bg-neutral-100 dark:bg-neutral-700 shadow-sm hover:opacity-100 text-primary"
              )}
            >
              <Icon className="size-5 text-neutral-600 dark:text-neutral-300" />
              {item.label}
            </div>
          </Link>
        );
      })}
    </ul>
  );
};

export default Navigation;
