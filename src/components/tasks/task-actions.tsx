"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ExternalLinkIcon, PencilIcon, Trash2Icon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import { useWorkspaceId } from "@/hooks/workspaces/use-workspace-id";
import useEditTaskModal from "@/hooks/tasks/use-edit-task-modal";
import { useConfirm } from "@/hooks/use-confirm";
import { useDeleteTask } from "@/hooks/tasks/use-delete-task";

type TaskActionsProps = {
  id: string;
  projectId: string;
  children: React.ReactNode;
};

const TaskActions = ({ id, projectId, children }: TaskActionsProps) => {
  const workspaceId = useWorkspaceId();

  const router = useRouter();

  const { onOpen } = useEditTaskModal();

  const [ConfirmDialog, confirm] = useConfirm(
    "Delete task",
    "This will permanently delete the task. Are you sure you want to proceed?"
  );

  const { mutate, isPending } = useDeleteTask();

  const onDelete = async () => {
    const ok = await confirm();
    if (!ok) return;

    mutate({ param: { taskId: id } });
  };

  const onOpenTask = () => {
    router.push(`/workspaces/${workspaceId}/tasks/${id}`);
  };

  const onOpenProject = () => {
    router.push(`/workspaces/${workspaceId}/projects/${projectId}`);
  };
  return (
    <div className="flex justify-end">
      <ConfirmDialog />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={onOpenTask} className="font-medium p-3">
            <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
            Task Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onOpenProject} className="font-medium p-3">
            <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
            Open Project
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onOpen(id)}
            className="font-medium p-3"
          >
            <PencilIcon className="size-4 mr-2 stroke-2" />
            Edit Task
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onDelete}
            disabled={isPending}
            className="text-red-600 focus:text-red-50 dark:text-red-700 dark:focus:text-red-50 font-medium p-3 focus:bg-red-600 dark:focus:bg-red-800"
          >
            <Trash2Icon className="size-4 mr-2 stroke-2" />
            Delete Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default TaskActions;
