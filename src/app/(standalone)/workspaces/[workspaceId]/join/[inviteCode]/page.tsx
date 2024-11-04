"use client";

import React from "react";

import JoinWorkspaceForm from "@/app/(standalone)/_components/join-workspace-form";

import Loader from "@/components/loader";
import ErrorPage from "@/components/error-page";

import { useGetWorkspaceInfo } from "@/hooks/workspaces/use-get-workspaces-info";
import { useWorkspaceId } from "@/hooks/workspaces/use-workspace-id";

const WorkpsaceIdJoinPage = () => {
  const workspaceId = useWorkspaceId();
  const { data: workspace, isLoading } = useGetWorkspaceInfo({
    workspaceId
  });

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

  return (
    <div className="h-full w-full max-w-2xl bg-sky-600 dark:bg-sky-700 rounded-lg p-4">
      <JoinWorkspaceForm initialValues={workspace} />
    </div>
  );
};

export default WorkpsaceIdJoinPage;
