import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRightIcon, Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";

import ProjectAvatar from "@/components/projects/project-avatar";

import { useWorkspaceId } from "@/hooks/workspaces/use-workspace-id";
import { useDeleteTask } from "@/hooks/tasks/use-delete-task";
import { useConfirm } from "@/hooks/use-confirm";

import { Project, Task } from "@/types";

interface TaskHeaderProps {
  project: Project;
  task: Task;
}

const TaskHeader = ({ task, project }: TaskHeaderProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const { mutate, isPending } = useDeleteTask();

  const [ConfirmDialog, confirm] = useConfirm(
    "Delete task",
    "This will permanently delete the task. Are you sure you want to proceed?"
  );

  const handleDeleteTask = async () => {
    const ok = await confirm();
    if (!ok) return;

    mutate(
      { param: { taskId: task.id } },
      {
        onSuccess: () => {
          router.push(`/workspaces/${workspaceId}/tasks`);
        }
      }
    );
  };
  return (
    <div className="flex items-center gap-x-2">
      <ConfirmDialog />
      <ProjectAvatar
        name={project.name}
        image={project.image || ""}
        className="size-6 lg:size-8"
      />
      <Link href={`/workspaces/${workspaceId}/projects/${project.id}`}>
        <p className="text-sm lg:text-lg font-semibold text-muted-foreground hover:opacity-75 transition">
          {project.name}
        </p>
      </Link>
      <ChevronRightIcon className="size-4 lg:size-5 text-muted-foreground" />
      <p className="text-sm lg:text-lg font-semibold">{task.name}</p>
      <Button
        onClick={handleDeleteTask}
        disabled={isPending}
        className="ml-auto"
        variant="destructive"
        size="sm"
      >
        <Trash2Icon className="size-4 lg:mr-2" />
        <span className="hidden lg:block">Delete Task</span>
      </Button>
    </div>
  );
};

export default TaskHeader;
