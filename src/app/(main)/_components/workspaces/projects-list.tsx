import React from "react";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import ProjectAvatar from "@/components/projects/project-avatar";

import useCreateProjectModal from "@/hooks/projects/use-create-project-modal";
import { useWorkspaceId } from "@/hooks/workspaces/use-workspace-id";

import { Project } from "@/types";

interface ProjectsListProps {
  data: Project[];
  total: number;
}

const ProjectsList = ({ data, total }: ProjectsListProps) => {
  const workspaceId = useWorkspaceId();

  const { onOpen } = useCreateProjectModal();

  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-white dark:bg-muted border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Projects ({total})</p>
          <Button variant="secondary" size="icon" onClick={onOpen}>
            <PlusIcon className="size-4 text-neutral-600 dark:text-neutral-200" />
          </Button>
        </div>

        <Separator className="my-4" />

        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {data.map((project) => (
            <li key={project.id}>
              <Link href={`/workspaces/${workspaceId}/projects/${project.id}`}>
                <Card className="dark:bg-muted shadow-none border rounded-lg hover:opacity-75 transition">
                  <CardContent className="p-4 flex items-center gap-x-2.5">
                    <ProjectAvatar
                      name={project.name}
                      image={project.image || ""}
                      className="size-12"
                      fallbackClassName="size-12 text-2xl"
                    />
                    <p className="text-lg font-medium truncate">
                      {project.name}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            No projects found
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProjectsList;
