"use client";

import React, { ChangeEvent, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ImageIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import Loader from "@/components/loader";

import { updateProjectSchema } from "@/lib/zod";

import { useConfirm } from "@/hooks/use-confirm";

import { useGetProject } from "@/hooks/projects/use-get-project";
import { useProjectId } from "@/hooks/projects/use-project-id";
import { useUpdateProject } from "@/hooks/projects/use-update-project";
import { useDeleteProject } from "@/hooks/projects/use-delete-project";

interface EditProjectFormProps {
  onCancel?: () => void;
}

const EditProjectForm = ({ onCancel }: EditProjectFormProps) => {
  const router = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);

  const projectId = useProjectId();
  const { data } = useGetProject({ projectId });

  const { mutate: updateProject, isPending: isUpdatePending } =
    useUpdateProject();
  const { mutate: deleteProject, isPending: isDeletePending } =
    useDeleteProject();

  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete Project",
    "This will permanently delete the project. Are you sure you want to proceed?"
  );

  const form = useForm<z.infer<typeof updateProjectSchema>>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      ...data,
      image: data?.image ?? ""
    }
  });

  const onSubmit = (values: z.infer<typeof updateProjectSchema>) => {
    const confirmValues = {
      ...values,
      image: values.image instanceof File ? values.image : ""
    };

    updateProject(
      { form: confirmValues, param: { projectId: projectId } },
      {
        onSuccess: ({ data }) => {
          form.reset();
          onCancel?.();

          if (data)
            router.push(`/workspaces/${data.workspaceId}/projects/${data.id}`);
        }
      }
    );
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) form.setValue("image", file);
  };

  const handleDelete = async () => {
    const ok = await confirmDelete();

    if (!ok) return;

    deleteProject(
      {
        param: { projectId: projectId }
      },
      {
        onSuccess: ({ data }) => {
          router.refresh();
          onCancel?.();
          router.push(`/workspaces/${data.workspaceId}`);
        }
      }
    );
  };

  if (!data) return;

  return (
    <div className="flex flex-col gap-y-4">
      <DeleteDialog />

      <Card className="w-full h-full border border-neutral-800 dark:border-neutral-600">
        <CardHeader className="flex p-7">
          <CardTitle className="text-xl font-bold">Project Settings</CardTitle>
          <CardDescription>Manage your {data.name}</CardDescription>
        </CardHeader>

        <Separator className="px-7" />

        <CardContent className="p-7">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter project name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <div className="flex flex-col gap-y-2">
                      <div className="flex items-center gap-x-5">
                        {field.value ? (
                          <div className="size-[72px] relative rounded-md overflow-hidden">
                            <Image
                              alt="project-image"
                              fill
                              className="object-cover"
                              src={
                                field.value instanceof File
                                  ? URL.createObjectURL(field.value)
                                  : field.value
                              }
                            />
                          </div>
                        ) : (
                          <Avatar className="size-[72px]">
                            <AvatarFallback>
                              <ImageIcon className="size-[36px] text-neutral-400 dark:text-neutral-500" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex flex-col">
                          <p className="text-sm font-medium">Project Icon</p>
                          <p className="text-sm text-muted-foreground">
                            Update the icon that represents your project
                          </p>
                          <input
                            className="hidden"
                            type="file"
                            accept=".jpg, .png, .jpeg, .svg"
                            ref={inputRef}
                            onChange={handleImageChange}
                            disabled={isUpdatePending || isDeletePending}
                          />
                          {field.value ? (
                            <Button
                              type="button"
                              disabled={isUpdatePending || isDeletePending}
                              variant="destructive"
                              size="xs"
                              className="w-fit mt-2"
                              onClick={() => {
                                field.onChange(null);
                                if (inputRef.current) {
                                  inputRef.current.value = "";
                                }
                              }}
                            >
                              Remove Image
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              disabled={isUpdatePending || isDeletePending}
                              variant="teritary"
                              size="xs"
                              className="w-fit mt-2"
                              onClick={() => inputRef.current?.click()}
                            >
                              Upload Image
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                />
              </div>

              <Separator className="mt-8" />

              <div className="flex items-center justify-end mt-4">
                <Button
                  variant="primary"
                  disabled={isUpdatePending || isDeletePending}
                  type="submit"
                  size="sm"
                >
                  {isUpdatePending ? <Loader /> : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>

        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold text-lg text-red-600 dark:text-red-700">
              Danger Zone
            </h3>
            <p className="text-sm text-muted-foreground">
              Once you delete a project, it cannot be recovered. Please be
              certain
            </p>
            <Separator className="mt-8" />
            <Button
              className="mt-6 w-fit ml-auto"
              size="sm"
              variant="destructive"
              type="button"
              disabled={isUpdatePending || isDeletePending}
              onClick={handleDelete}
            >
              Delete project
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProjectForm;
