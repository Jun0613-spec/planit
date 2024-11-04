import React from "react";
import { MdModeEdit } from "react-icons/md";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import MemberAvatar from "@/components/members/member-avatar";
import OverviewProperty from "@/components/tasks/overview-property";
import TaskDate from "@/components/tasks/task-date";

import useEditTaskModal from "@/hooks/tasks/use-edit-task-modal";

import { PopulatedTask } from "@/types";

import { convertSnakeCaseToTitleCase } from "@/lib/utils";

interface TaskOverviewProps {
  task: PopulatedTask;
}

const TaskOverView = ({ task }: TaskOverviewProps) => {
  const { onOpen } = useEditTaskModal();

  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Overview</p>
          <Button onClick={() => onOpen(task.id)} size="sm" variant="outline">
            <MdModeEdit className="size-4 mr-2" />
            Edit
          </Button>
        </div>
        <Separator className="my-4" />
        <div className="flex flex-col gap-y-4">
          <OverviewProperty label="Assignee">
            <MemberAvatar
              name={task.assignee?.name}
              image={task.assignee?.image || ""}
              className="size-6"
              fallbackClassName="size-6 text-sm"
            />
            <p className="text-sm font-medium">{task.assignee?.name}</p>
          </OverviewProperty>
          <OverviewProperty label="Due Date">
            <TaskDate
              value={task.dueDate?.toString() || ""}
              className="text-sm font-medium"
            />
          </OverviewProperty>
          <OverviewProperty label="Status">
            <Badge variant={task.status}>
              {convertSnakeCaseToTitleCase(task.status)}
            </Badge>
          </OverviewProperty>
        </div>
      </div>
    </div>
  );
};

export default TaskOverView;
