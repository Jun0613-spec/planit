"use client";

import React from "react";

import Loader from "@/components/loader";
import ErrorPage from "@/components/error-page";

import { useWorkspaceId } from "@/hooks/workspaces/use-workspace-id";
import { useGetWorkspacePerformance } from "@/hooks/workspaces/use-get-workspace-performance";
import { useGetTasks } from "@/hooks/tasks/use-get-tasks";
import { useGetProjects } from "@/hooks/projects/use-get-projects";
import { useGetMembers } from "@/hooks/members/use-get-members";

import { Member, PopulatedTask, Project } from "@/types";

import Performance from "@/components/performance";

import TasksList from "../../_components/workspaces/tasks-list";
import ProjectsList from "../../_components/workspaces/projects-list";
import MembersList from "../../_components/workspaces/members-list";

const WorkspcaeIdPage = () => {
  const workspaceId = useWorkspaceId();

  const { data: performance, isLoading: isLoadingPerformance } =
    useGetWorkspacePerformance({ workspaceId });
  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
    workspaceId
  });
  const { data: projects, isLoading: isLoadinProjects } = useGetProjects({
    workspaceId
  });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId
  });

  const isLoading =
    isLoadingPerformance ||
    isLoadingTasks ||
    isLoadinProjects ||
    isLoadingMembers;

  const error = !performance || !tasks || !projects || !members;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <ErrorPage message="Failed to load workspace data" />;
  }

  const taskData: PopulatedTask[] = (tasks?.documents as PopulatedTask[]) || [];
  const projectData: Project[] = (projects as Project[]) || [];
  const memberData: Member[] = (members as Member[]) || [];

  return (
    <div className="h-full flex flex-col space-y-4">
      <Performance data={performance} />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <TasksList data={taskData} total={taskData.length} />
        <ProjectsList data={projectData} total={projectData.length} />
        <MembersList data={memberData} total={memberData.length} />
      </div>
    </div>
  );
};

export default WorkspcaeIdPage;
