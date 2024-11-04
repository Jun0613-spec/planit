import { Card, CardContent } from "@/components/ui/card";

import EditTaskForm from "@/components/tasks/edit-task-form";
import Loader from "@/components/loader";

import { useGetProjects } from "@/hooks/projects/use-get-projects";
import { useGetMembers } from "@/hooks/members/use-get-members";
import { useWorkspaceId } from "@/hooks/workspaces/use-workspace-id";
import { useGetTask } from "@/hooks/tasks/use-get-task";
import { PopulatedTask } from "@/types";

interface EditTaskFormWrapperProps {
  onCancel: () => void;
  id: string;
}

const EditTaskFormWrapper = ({ onCancel, id }: EditTaskFormWrapperProps) => {
  const workspaceId = useWorkspaceId();

  const { data: initialValues, isLoading: isLoadingTask } = useGetTask({
    taskId: id
  });

  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId
  });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId
  });

  const projectOptions =
    projects?.map((project) => ({
      id: project.id,
      name: project.name ?? "",
      image: project.image ?? ""
    })) || [];

  const memberOptions =
    members?.map((member) => ({
      id: member.id,
      name: member.name ?? "",
      image: member.image ?? ""
    })) || [];

  const isLoading = isLoadingMembers || isLoadingProjects || isLoadingTask;

  if (isLoading) {
    return (
      <Card className="w-full h-[714px] border border-neutral-800 dark:border-neutral-600">
        <CardContent className="flex items-center justify-center h-full">
          <Loader />
        </CardContent>
      </Card>
    );
  }

  if (!initialValues) return null;

  return (
    <EditTaskForm
      initialValues={initialValues as PopulatedTask}
      onCancel={onCancel}
      projectOptions={projectOptions}
      memberOptions={memberOptions}
    />
  );
};

export default EditTaskFormWrapper;
