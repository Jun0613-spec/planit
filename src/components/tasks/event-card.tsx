import React from "react";
import { useRouter } from "next/navigation";

import ProjectAvatar from "../projects/project-avatar";
import MemberAvatar from "../members/member-avatar";

import { useWorkspaceId } from "@/hooks/workspaces/use-workspace-id";

import { AssingeeUser, Project, TaskStatus } from "@/types";

import { cn } from "@/lib/utils";

interface EventCardProps {
  id: string;
  title: string;
  description?: string;
  assignee?: AssingeeUser;
  project?: Project;
  status: TaskStatus;
}

const statusColorMap: Record<TaskStatus, string> = {
  [TaskStatus.BACKLOG]: "border-l-neutral-600 dark:border-l-neutral-700",
  [TaskStatus.TODO]: "border-l-orange-500 dark:border-l-orange-600",
  [TaskStatus.IN_PROGRESS]: "border-l-emerald-500 dark:border-l-emerald-600",
  [TaskStatus.IN_REVIEW]: "border-l-yellow-500 dark:border-l-yellow-600",
  [TaskStatus.DONE]: "border-l-blue-500 dark:border-l-blue-600"
};

const EventCard = ({
  id,
  title,
  description,
  assignee,
  project,
  status
}: EventCardProps) => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    router.push(`/workspaces/${workspaceId}/tasks/${id}`);
  };

  return (
    <div className="px-0.5 md:px-2">
      <div
        className={cn(
          "p-0.5 md:p-1.5 bg-white dark:bg-neutral-700 border rounded-md border-l-4 flex flex-col gap-y-1 md:gap-y-2 cursor-pointer hover:opacity-75 transition max-w-[95vw] md:max-w-none",
          statusColorMap[status]
        )}
        onClick={onClick}
      >
        <p className="text-[10px] md:text-xs font-semibold truncate">{title}</p>
        {description ? (
          <p className="text-[8px] md:text-[9px] text-neutral-500 dark:text-neutral-400 truncate">
            {description}
          </p>
        ) : null}
        <div className="flex items-center gap-x-1">
          <MemberAvatar
            name={assignee?.name || ""}
            image={assignee?.image || ""}
            fallbackClassName="text-xs md:text-sm size-4 md:size-6"
            className="size-4 md:size-6"
          />
          <div className="w-1 h-1 rounded-full bg-neutral-300" />

          <ProjectAvatar
            name={project?.name || ""}
            image={project?.image || ""}
            fallbackClassName="text-xs md:text-sm size-4 md:size-6"
            className="size-4 md:size-6"
          />
        </div>
      </div>
    </div>
  );
};

export default EventCard;
