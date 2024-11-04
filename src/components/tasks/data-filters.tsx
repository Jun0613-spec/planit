import React from "react";
import { FolderIcon, ListCheckIcon, User2Icon } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import DatePicker from "@/components/date-picker";
import Loader from "@/components/loader";

import { useGetMembers } from "@/hooks/members/use-get-members";
import { useGetProjects } from "@/hooks/projects/use-get-projects";
import { useWorkspaceId } from "@/hooks/workspaces/use-workspace-id";
import { useTaskFiltersStore } from "@/stores/tasks/use-task-filters-store";

import { TaskStatus } from "@/types";

interface DataFiltersProps {
  hideProjectFilter?: boolean;
}

const DataFilters = ({ hideProjectFilter }: DataFiltersProps) => {
  const workspaceId = useWorkspaceId();

  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId
  });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId
  });

  const isLoading = isLoadingProjects || isLoadingMembers;

  const projectOptions = projects?.map((project) => ({
    value: project.id,
    label: project.name
  }));

  const memberOptions = members?.map((member) => ({
    value: member.id,
    label: member.name
  }));

  const { status, assigneeId, projectId, dueDate, setFilter } =
    useTaskFiltersStore();

  if (isLoading) return <Loader />;

  return (
    <div className="flex flex-col lg:flex-row gap-2">
      {/* All Statuses */}
      <Select
        defaultValue={status ?? undefined}
        onValueChange={(value) =>
          setFilter("status", value === "all" ? null : (value as TaskStatus))
        }
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <ListCheckIcon className="size-4 mr-2" />
            <SelectValue placeholder="All statuses" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectSeparator />
          <SelectItem value={TaskStatus.BACKLOG}>Backlog</SelectItem>
          <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
          <SelectItem value={TaskStatus.IN_REVIEW}>In Review</SelectItem>
          <SelectItem value={TaskStatus.TODO}>Todo</SelectItem>
          <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
        </SelectContent>
      </Select>
      {/* Assignee */}
      <Select
        defaultValue={assigneeId ?? undefined}
        onValueChange={(value) =>
          setFilter("assigneeId", value === "all" ? null : (value as string))
        }
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <User2Icon className="size-4 mr-2" />
            <SelectValue placeholder="All assignees" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All assignees</SelectItem>
          <SelectSeparator />
          {memberOptions?.map((member) => (
            <SelectItem key={member.value} value={member.value}>
              {member.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {!hideProjectFilter && (
        <Select
          defaultValue={projectId ?? undefined}
          onValueChange={(value) =>
            setFilter("projectId", value === "all" ? null : (value as string))
          }
        >
          <SelectTrigger className="w-full lg:w-auto h-8">
            <div className="flex items-center pr-2">
              <FolderIcon className="size-4 mr-2" />
              <SelectValue placeholder="All projects" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All projects</SelectItem>
            <SelectSeparator />
            {projectOptions?.map((project) => (
              <SelectItem key={project.value} value={project.value}>
                {project.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      <DatePicker
        placeholder="Due date"
        className="h-8 w-full lg:w-auto"
        value={dueDate ? new Date(dueDate) : undefined}
        onChange={(date) => {
          setFilter("dueDate", date ? date.toISOString() : null);
        }}
      />
    </div>
  );
};

export default DataFilters;
