"use client";

import React from "react";

import MembersList from "@/app/(main)/_components/members/member-list";

import Loader from "@/components/loader";
import ErrorPage from "@/components/error-page";

import { useWorkspaceId } from "@/hooks/workspaces/use-workspace-id";
import { useGetUser } from "@/hooks/users/use-get-user";
import { useGetWorkspace } from "@/hooks/workspaces/use-get-workspace";

const MembersPage = () => {
  const workspaceId = useWorkspaceId();
  const {
    data: user,
    isLoading: isUserLoading,
    error: userError
  } = useGetUser();
  const { data: workspace, isLoading: isWorkspaceLoading } = useGetWorkspace({
    workspaceId
  });

  const isLoading = isUserLoading || isWorkspaceLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  if (userError || !user) {
    return <ErrorPage message="You need to be logged in." />;
  }

  if (!workspace) {
    return <ErrorPage message="Workspace not found" />;
  }

  return (
    <div className=" bg-sky-600 dark:bg-sky-700 rounded-lg p-4">
      <MembersList />
    </div>
  );
};

export default MembersPage;
