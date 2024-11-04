"use client";

import React from "react";
import { RiAddCircleFill } from "react-icons/ri";
import { usePathname } from "next/navigation";
import Link from "next/link";

import ProjectAvatar from "../../../../components/projects/project-avatar";

import { useGetProjects } from "@/hooks/projects/use-get-projects";
import { useWorkspaceId } from "@/hooks/workspaces/use-workspace-id";

import useCreateProjectModal from "@/hooks/projects/use-create-project-modal";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const ProjectList = () => {
  const pathname = usePathname();

  const workspaceId = useWorkspaceId();
  const { data = [], isLoading } = useGetProjects({ workspaceId });

  const { onOpen } = useCreateProjectModal();

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase font-bold text-neutral-600 dark:text-neutral-300">
          Projects
        </p>
        <RiAddCircleFill
          onClick={onOpen}
          className="text-neutral-600 dark:text-neutral-300 cursor-pointer size-5 hover:opacity-75 transition"
        />
      </div>
      {data?.map((project) => {
        const href = `/workspaces/${workspaceId}/projects/${project.id}`;
        const isActive = pathname === href;

        return (
          <Link href={href} key={project.id}>
            <div
              className={cn(
                "flex items-center gap-2 rounded-md hover:opacity-75 transition cursor-pointer text-neutral-500 dark:text-neutral-400",
                isActive &&
                  "bg-neutral-100 dark:bg-neutral-700 shadow-sm hover:opacity-100 text-primary"
              )}
            >
              {isLoading ? (
                <div className="flex flex-col space-y-2">
                  {Array(project).map((_, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2.5 rounded-md p-1 bg-neutral-300 dark:bg-neutral-600"
                    >
                      <Skeleton className="size-5 rounded-md bg-neutral-400 dark:bg-neutral-500" />
                      <Skeleton className="h-5 w-52 rounded-md" />
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <ProjectAvatar
                    name={project.name}
                    image={project.image ?? ""}
                  />
                  <span className="truncate">{project.name}</span>
                </>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default ProjectList;
