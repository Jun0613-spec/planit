import React from "react";
import { CalendarIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { useWorkspaceId } from "@/hooks/workspaces/use-workspace-id";
import useCreateTaskModal from "@/hooks/tasks/use-create-task-modal";

import { PopulatedTask } from "@/types";

interface TasksListProps {
  data: PopulatedTask[];
  total: number;
}

const TasksList = ({ data, total }: TasksListProps) => {
  const workspaceId = useWorkspaceId();

  const { onOpen } = useCreateTaskModal();

  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-white dark:bg-muted border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Tasks ({total})</p>
          <Button variant="secondary" size="icon" onClick={onOpen}>
            <PlusIcon className="size-4 text-neutral-600 dark:text-neutral-200" />
          </Button>
        </div>

        <Separator className="my-4" />

        <ul className="flex flex-col gap-y-4">
          {data.map((task) => (
            <li key={task.id}>
              <Link href={`/workspaces/${workspaceId}/tasks/${task.id}`}>
                <Card className="dark:bg-muted shadow-none border  rounded-lg hover:opacity-75 transition">
                  <CardContent className="p-4">
                    <p className="text-lg font-medium truncate">{task.name}</p>
                    <div className="flex items-center gap-x-2">
                      <p>{task?.project?.name}</p>
                      <div className="size-1 rounded-full bg-neutral-600 dark:bg-neutral-300" />
                      <div className="text-sm text-muted-foreground flex items-center">
                        <CalendarIcon className="size-3 mr-1" />
                        <span className="truncate">
                          {formatDistanceToNow(
                            new Date(task.dueDate?.toString() || "")
                          )}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            No tasks found
          </li>
        </ul>
        <Button variant="secondary" className="mt-4 w-full" asChild>
          <Link href={`/workspaces/${workspaceId}/tasks`}>Show All</Link>
        </Button>
      </div>
    </div>
  );
};

export default TasksList;
