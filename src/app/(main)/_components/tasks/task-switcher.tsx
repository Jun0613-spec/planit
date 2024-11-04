"use client";

import React, { useCallback } from "react";
import { PlusIcon } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { columns } from "@/components/tasks/columns";
import { DataTable } from "@/components/tasks/data-table";
import DataFilters from "@/components/tasks/data-filters";
import DataBoard from "@/components/tasks/data-board";
import DataCalendar from "@/components/tasks/data-calendar";
import Loader from "@/components/loader";

import useCreateTaskModal from "@/hooks/tasks/use-create-task-modal";
import { useGetTasks } from "@/hooks/tasks/use-get-tasks";
import { useWorkspaceId } from "@/hooks/workspaces/use-workspace-id";
import { useProjectId } from "@/hooks/projects/use-project-id";
import { useMoveBoardTasks } from "@/hooks/tasks/use-move-board-tasks";

import { useTaskViewStore } from "@/stores/tasks/use-task-view-store";
import { useTaskFiltersStore } from "@/stores/tasks/use-task-filters-store";

import { PopulatedTask, TaskStatus } from "@/types";

interface TaskSwitcherProps {
  hideProjectFilter?: boolean;
}

const TaskSwitcher = ({ hideProjectFilter }: TaskSwitcherProps) => {
  const { onOpen } = useCreateTaskModal();
  const { view, setView } = useTaskViewStore();
  const { status, assigneeId, projectId, dueDate } = useTaskFiltersStore();

  const workspaceId = useWorkspaceId();
  const paramProjectId = useProjectId();

  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
    workspaceId,
    status,
    assigneeId,
    projectId: paramProjectId || projectId,
    dueDate
  });

  const { mutate: moveBoard } = useMoveBoardTasks();

  const taskData: PopulatedTask[] = (tasks?.documents as PopulatedTask[]) ?? [];

  const onBoardChange = useCallback(
    (
      tasks: {
        id: string;
        status: TaskStatus;
        position: number;
      }[]
    ) => {
      const taskUpdates = tasks.map(({ id, status, position }) => ({
        id,
        status,
        position
      }));

      moveBoard({ json: { taskUpdates } });
    },
    [moveBoard]
  );

  return (
    <Tabs
      defaultValue={view}
      onValueChange={setView}
      className="flex-1 w-full border rounded-lg"
    >
      <div className="h-full flex flex-col overflow-auto p-4">
        <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
          <TabsList className="w-full lg:w-auto ">
            <TabsTrigger className="h-8 w-full lg:w-auto" value="table">
              Table
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="board">
              Board
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="calendar">
              Calendar
            </TabsTrigger>
          </TabsList>

          <Button
            onClick={onOpen}
            variant="primary"
            size="sm"
            className="w-full lg:w-auto "
          >
            <PlusIcon className="mr-2 size-4" />
            New
          </Button>
        </div>
        <Separator className="my-4" />
        <DataFilters hideProjectFilter={hideProjectFilter} />
        <Separator className="my-4" />
        {isLoadingTasks ? (
          <div className="w-full border rounded-lg h-[200px] flex flex-col items-center justify-center">
            <Loader />
          </div>
        ) : (
          <>
            <TabsContent value="table" className="mt-0">
              <DataTable columns={columns} data={taskData} />
            </TabsContent>
            <TabsContent value="board" className="mt-0">
              <DataBoard onChange={onBoardChange} data={taskData} />
            </TabsContent>
            <TabsContent value="calendar" className="mt-0 h-full pb-4">
              <DataCalendar data={taskData} />
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
};

export default TaskSwitcher;
