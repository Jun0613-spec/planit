"use client";

import React from "react";

import { useGetMembers } from "@/hooks/members/use-get-members";
import { useGetProjects } from "@/hooks/projects/use-get-projects";
import { useWorkspaceId } from "@/hooks/workspaces/use-workspace-id";

import { Card, CardContent } from "../ui/card";

import Loader from "../loader";
import CreateTaskForm from "./create-task-form";

interface CreateTaskFormWrapperProps {
  onCancel?: () => void;
}

const CreateTaskFormWrapper = ({ onCancel }: CreateTaskFormWrapperProps) => {
  const workspaceId = useWorkspaceId();

  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId
  });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId
  });

  const projectOptions =
    projects?.map((project) => ({
      id: project.id,
      name: project.name ?? "",
      image: project.image ?? ""
    })) || [];

  const memberOptions =
    members?.map((member) => ({
      id: member.id,
      name: member.name ?? "",
      image: member.image ?? ""
    })) || [];

  const isLoading = isLoadingProjects || isLoadingMembers;

  if (isLoading) {
    return (
      <Card className="w-full h-[714px] border border-neutral-800 dark:border-neutral-600">
        <CardContent className="flex items-center justify-center h-full">
          <Loader />
        </CardContent>
      </Card>
    );
  }

  return (
    <CreateTaskForm
      onCancel={onCancel}
      projectOptions={projectOptions}
      memberOptions={memberOptions}
    />
  );
};

export default CreateTaskFormWrapper;
