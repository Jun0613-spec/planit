"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import DatePicker from "@/components/date-picker";
import MemberAvatar from "@/components/members/member-avatar";
import ProjectAvatar from "@/components/projects/project-avatar";

import { cn } from "@/lib/utils";
import { updateTaskSchema } from "@/lib/zod";

import { useUpdateTask } from "@/hooks/tasks/use-update-task";

import { PopulatedTask, TaskStatus } from "@/types";
import Loader from "../loader";

interface EditTaskFormProps {
  onCancel?: () => void;
  projectOptions: { id: string; name: string; image: string }[];
  memberOptions: { id: string; name: string; image: string }[];
  initialValues: PopulatedTask;
}

const EditTaskForm = ({
  onCancel,
  projectOptions,
  memberOptions,
  initialValues
}: EditTaskFormProps) => {
  const { mutate, isPending } = useUpdateTask();

  const form = useForm<z.infer<typeof updateTaskSchema>>({
    resolver: zodResolver(
      updateTaskSchema.omit({ workspaceId: true, description: true })
    ),
    defaultValues: {
      ...initialValues,
      dueDate: initialValues.dueDate
        ? new Date(initialValues.dueDate)
        : undefined,
      description: initialValues.description ?? undefined
    }
  });

  const onSubmit = (values: z.infer<typeof updateTaskSchema>) => {
    mutate(
      { json: values, param: { taskId: initialValues.id } },
      {
        onSuccess: () => {
          form.reset();
          onCancel?.();
        }
      }
    );
  };

  return (
    <Card className="w-full h-full border border-neutral-800 dark:border-neutral-600">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">Edit a Task</CardTitle>
      </CardHeader>

      <div className="px-7">
        <Separator />
      </div>

      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter task name"
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task description</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Task description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <DatePicker {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="assigneeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignee</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select assignee" />
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage />
                      <SelectContent>
                        {memberOptions.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            <div className="flex items-center gap-x-2">
                              <MemberAvatar
                                className="size-6"
                                name={member.name}
                                image={member.image}
                              />
                              {member.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage />
                      <SelectContent>
                        <SelectItem value={TaskStatus.BACKLOG}>
                          Backlog
                        </SelectItem>
                        <SelectItem value={TaskStatus.TODO}>Todo</SelectItem>
                        <SelectItem value={TaskStatus.IN_PROGRESS}>
                          In Progress
                        </SelectItem>
                        <SelectItem value={TaskStatus.IN_REVIEW}>
                          In Review
                        </SelectItem>
                        <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage />
                      <SelectContent>
                        {projectOptions.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            <div className="flex items-center gap-x-2">
                              <ProjectAvatar
                                className="size-6"
                                name={project.name}
                                image={project.image}
                              />
                              {project.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator className="mt-8" />

            <div className="flex items-center justify-between mt-4">
              <Button
                disabled={isPending}
                type="button"
                size="lg"
                variant="destructive"
                onClick={onCancel}
                className={cn(!onCancel && "invisible")}
              >
                Cancle
              </Button>
              <Button
                variant="primary"
                disabled={isPending}
                type="submit"
                size="lg"
              >
                {isPending ? <Loader /> : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default EditTaskForm;
