"use client";

import React from "react";

import EditWorkspaceForm from "@/components/workspaces/edit-workspace-form";

import { useWorkspaceId } from "@/hooks/workspaces/use-workspace-id";
import { useGetWorkspace } from "@/hooks/workspaces/use-get-workspace";

import Loader from "@/components/loader";
import ErrorPage from "@/components/error-page";

const SettingsPage = () => {
  const workspaceId = useWorkspaceId();
  const { data: workspace, isLoading } = useGetWorkspace({ workspaceId });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  if (!workspace) {
    return <ErrorPage message="Workspace not found" />;
  }

  const initialValues = {
    ...workspace,
    createdAt: workspace.createdAt ? new Date(workspace.createdAt) : null,
    updatedAt: workspace.updatedAt ? new Date(workspace.updatedAt) : null
  };

  return (
    <div className="bg-sky-600 dark:bg-sky-700 rounded-lg p-4">
      <EditWorkspaceForm initialValues={initialValues} />
    </div>
  );
};

export default SettingsPage;
