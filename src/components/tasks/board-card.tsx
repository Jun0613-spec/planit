import React from "react";
import { MoreHorizontal } from "lucide-react";

import TaskActions from "@/components/tasks/task-actions";
import TaskDate from "@/components/tasks/task-date";
import MemberAvatar from "@/components/members/member-avatar";
import ProjectAvatar from "@/components/projects/project-avatar";

import { Separator } from "@/components/ui/separator";

import { PopulatedTask } from "@/types";

interface BoardCardProps {
  task: PopulatedTask;
}

const BoardCard = ({ task }: BoardCardProps) => {
  return (
    <div className="bg-white dark:bg-neutral-700 p-2.5 mb-1.5 rounded shadow-sm space-y-3">
      <div className="flex flex-col gap-x-2">
        <p className="text-sm line-clamp-2">{task.name}</p>

        <p className="text-xs text-neutral-400"> {task.description}</p>
        <TaskActions id={task.id} projectId={task.projectId}>
          <MoreHorizontal className="size-5 stroke-1 shrink-0 text-neutral-700 dark:text-neutral-300 hover:opacity-75 transition" />
        </TaskActions>
      </div>
      <Separator className="mt-6" />
      <div className="flex items-center gap-x-1.5">
        <MemberAvatar
          name={task.assignee?.name}
          image={task.assignee?.image || ""}
          fallbackClassName="text-sm size-6"
          className="size-6"
        />
        <div className="size-1 rounded-full bg-neutral-300 " />
        <TaskDate value={task.dueDate?.toString() ?? ""} className="text-xs" />
      </div>
      <div className="flex items-center gap-x-1.5">
        <ProjectAvatar
          name={task.project?.name || ""}
          image={task.project?.image || ""}
          fallbackClassName="text-sm size-6"
          className="size-6"
        />
        <span className="text-xs font-medium">{task.project?.name}</span>
      </div>
    </div>
  );
};

export default BoardCard;
