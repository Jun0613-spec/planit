"use client";

import React from "react";
import { RiAddCircleFill } from "react-icons/ri";
import { useRouter } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

import WorkspaceAvatar from "./workspace-avatar";

import { useGetWorkspaces } from "@/hooks/workspaces/use-get-workspaces";
import { useWorkspaceId } from "@/hooks/workspaces/use-workspace-id";
import useCreateWorkspaceModal from "@/hooks/workspaces/use-create-workspace-modal";

const WorkspaceSwitcher = () => {
  const currentWorkspaceId = useWorkspaceId();
  const { data = [], isLoading } = useGetWorkspaces();

  const { onOpen } = useCreateWorkspaceModal();

  const router = useRouter();

  const onSelect = (id: string) => {
    router.push(`/workspaces/${id}`);
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase font-bold text-neutral-600 dark:text-neutral-300">
          Workspaces
        </p>
        <RiAddCircleFill
          onClick={onOpen}
          className="text-neutral-600 dark:text-neutral-300 cursor-pointer size-5 hover:opacity-75 transition"
        />
      </div>

      <Select onValueChange={onSelect} value={currentWorkspaceId}>
        <SelectTrigger className="w-full bg-neutral-100 dark:bg-neutral-600 font-medium p-2">
          {isLoading ? (
            <div className="flex items-center justify-between gap-4">
              <Skeleton className="w-7 h-7 relative rounded-md overflow-hidden" />
              <Skeleton className="w-36 h-7 rounded-md" />
            </div>
          ) : (
            <SelectValue placeholder="Select a workspace" />
          )}
        </SelectTrigger>
        <SelectContent>
          {Array.isArray(data) &&
            data.length > 0 &&
            data.map((workspace) => (
              <SelectItem key={workspace.id} value={workspace.id}>
                <div className="flex justify-start items-center gap-3 font-medium">
                  <WorkspaceAvatar
                    name={workspace.name}
                    image={workspace.image ?? ""}
                  />
                  <span className="truncate">{workspace.name}</span>
                </div>
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default WorkspaceSwitcher;
