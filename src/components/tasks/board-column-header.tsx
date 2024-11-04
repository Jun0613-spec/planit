import React from "react";
import {
  CircleCheckIcon,
  CircleDashedIcon,
  CircleDotDashedIcon,
  CircleDotIcon,
  CircleIcon,
  PlusIcon
} from "lucide-react";

import { Button } from "@/components/ui/button";

import useCreateTaskModal from "@/hooks/tasks/use-create-task-modal";

import { convertSnakeCaseToTitleCase } from "@/lib/utils";

import { TaskStatus } from "@/types";

interface BoardColumnHeaderProps {
  board: TaskStatus;
  taskCount: number;
}

const statusIconMap: Record<TaskStatus, React.ReactNode> = {
  [TaskStatus.BACKLOG]: (
    <CircleDashedIcon className="size-5 text-neutral-600 dark:text-neutral-700" />
  ),
  [TaskStatus.TODO]: (
    <CircleIcon className="size-5 text-orange-500 dark:text-orange-600" />
  ),
  [TaskStatus.IN_PROGRESS]: (
    <CircleDotDashedIcon className="size-5 text-emerald-500 dark:text-emerald-600" />
  ),
  [TaskStatus.IN_REVIEW]: (
    <CircleDotIcon className="size-5 text-yellow-500 dark:text-yellow-600" />
  ),
  [TaskStatus.DONE]: (
    <CircleCheckIcon className="size-5 text-blue-500 dark:text-blue-600" />
  )
};

const BoardColumnHeader = ({ board, taskCount }: BoardColumnHeaderProps) => {
  const { onOpen } = useCreateTaskModal();
  const icon = statusIconMap[board];

  return (
    <div className="px-2 py-1.5 flex items-center justify-between">
      <div className="flex items-center gap-x-2">
        {icon}
        <h2 className="text-sm font-medium">
          {convertSnakeCaseToTitleCase(board)}
        </h2>
        <div className="size-5 flex items-center justify-center rounded-md bg-neutral-200 dark:bg-neutral-300 text-xs text-neutral-700 dark:text-neutral-600 font-medium">
          {taskCount}
        </div>
      </div>
      <Button
        onClick={onOpen}
        variant="ghost"
        size="icon"
        className="size-5 hover:opacity-60"
      >
        <PlusIcon className="size-5 text-neutral-500 dark:text-neutral-300" />
      </Button>
    </div>
  );
};

export default BoardColumnHeader;
