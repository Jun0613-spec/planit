"use client";

import React from "react";

import Loader from "@/components/loader";
import ErrorPage from "@/components/error-page";
import TaskHeader from "@/components/tasks/task-navigation";
import TaskOverView from "@/components/tasks/task-over-view";

import { Separator } from "@/components/ui/separator";

import { useGetTask } from "@/hooks/tasks/use-get-task";
import { useTaskId } from "@/hooks/tasks/use-task-id";

import { Project, PopulatedTask } from "@/types";
import TaskDescription from "@/components/tasks/task-description";

const TaskIdPage = () => {
  const taskId = useTaskId();

  const { data, isLoading } = useGetTask({ taskId });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  if (!data || !data.project) {
    return <ErrorPage message="Task or Project not found" />;
  }

  return (
    <div className="flex flex-col">
      <TaskHeader
        project={data.project as Project}
        task={data as PopulatedTask}
      />
      <Separator className="my-6" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TaskOverView task={data as PopulatedTask} />
        <TaskDescription task={data as PopulatedTask} />
      </div>
    </div>
  );
};

export default TaskIdPage;
