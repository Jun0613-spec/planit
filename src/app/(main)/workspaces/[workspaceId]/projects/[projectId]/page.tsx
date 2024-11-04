"use client";

import React from "react";
import { PencilIcon } from "lucide-react";

import ProjectAvatar from "@/components/projects/project-avatar";
import Loader from "@/components/loader";
import ErrorPage from "@/components/error-page";
import Performance from "@/components/performance";

import { Button } from "@/components/ui/button";

import TaskSwitcher from "@/app/(main)/_components/tasks/task-switcher";

import { useProjectId } from "@/hooks/projects/use-project-id";
import { useGetProject } from "@/hooks/projects/use-get-project";
import useEditProjectModal from "@/hooks/projects/use-edit-project-modal";
import { useGetProjectPerformance } from "@/hooks/projects/use-get-project-performance";

const ProjectIdPage = () => {
  const { onOpen } = useEditProjectModal();

  const projectId = useProjectId();

  const { data: project, isLoading: isLoadingProject } = useGetProject({
    projectId
  });
  const { data: performance, isLoading: isLoadingPerformance } =
    useGetProjectPerformance({
      projectId
    });

  const isLoading = isLoadingProject || isLoadingPerformance;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  if (!project) {
    return <ErrorPage message="Project not found" />;
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar
            name={project.name}
            image={project.image ?? ""}
            className="size-8"
            fallbackClassName="text-lg"
          />
          <p className="text-lg font-semibold">{project.name}</p>
        </div>
        <div>
          <Button onClick={onOpen} variant="secondary" size="sm">
            <PencilIcon className="size-4 mr-2" />
            Edit Project
          </Button>
        </div>
      </div>
      {performance && <Performance data={performance} />}
      <TaskSwitcher hideProjectFilter />
    </div>
  );
};

export default ProjectIdPage;
