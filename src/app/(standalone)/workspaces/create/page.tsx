"use client";

import React from "react";

import CreateWorkspaceForm from "@/components/workspaces/create-workspace-form";
import Loader from "@/components/loader";
import ErrorPage from "@/components/error-page";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { useGetUser } from "@/hooks/users/use-get-user";

const WorkspaceCreatePage = () => {
  const { data, isLoading, isError } = useGetUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  if (isError || !data) {
    <ErrorPage message="User not found. You need to login" />;
  }

  return (
    <div className="h-full w-full max-w-2xl bg-sky-600 dark:bg-sky-700 rounded-lg p-4">
      <div className="w-full lg:max-w-3xl mx-auto flex flex-col items-center justify-center ">
        <Card className="w-full shadow-lg border dark:border-neutral-500 ">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold mb-2">
              Welcome, {data?.data.name}! 🎉
            </CardTitle>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              You&apos;re just one step away. Create a workspace to get started.
            </p>
            <div className="mt-4 p-4 bg-sky-100 dark:bg-sky-800 border-l-4 border-sky-600 rounded-md  dark:border-sky-700 dark:text-sky-200">
              <strong className="text-base font-bold text-sky-800 dark:text-sky-400">
                Have an invite link?
              </strong>
              <p className="text-sky-700 dark:text-sky-300">
                If you have an invite link, you can paste it in the URL address
                bar to join an existing workspace.
              </p>
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="mt-8">
            <div className="w-full">
              <CreateWorkspaceForm />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkspaceCreatePage;
