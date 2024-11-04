"use client";

import { toast } from "sonner";
import React, { ChangeEvent, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CopyIcon, ImageIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

import { updateWorkspaceSchema } from "@/lib/zod";

import { Workspace } from "@/types";

import { useConfirm } from "@/hooks/use-confirm";
import { useUpdateWorkspace } from "@/hooks/workspaces/use-update-workspace";
import { useDeleteWorkspace } from "@/hooks/workspaces/use-delete-workspace";
import { useResetInviteCodeWorkspace } from "@/hooks/workspaces/use-reset-invite-code";

interface EditWorkspaceFormProps {
  onCancel?: () => void;
  initialValues: Workspace;
}

const EditWorkspaceForm = ({
  onCancel,
  initialValues
}: EditWorkspaceFormProps) => {
  const { mutate: updateWorkspace, isPending: isUpdatePending } =
    useUpdateWorkspace();
  const { mutate: deleteWorkspace, isPending: isDeletePending } =
    useDeleteWorkspace();
  const {
    mutate: resetInviteCodeWorkspace,
    isPending: isResetInviteCodePending
  } = useResetInviteCodeWorkspace();

  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete Workspace",
    "This will permanently delete the workspace. Are you sure you want to proceed?"
  );

  const [ResetInviteCodeDialog, confirmResetInviteCode] = useConfirm(
    "Reset Invite Code",
    "This will invalidate the current invite code and create a new one. Do you wish to continue?"
  );

  const router = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      ...initialValues,
      image: initialValues.image ?? ""
    }
  });

  const onSubmit = (values: z.infer<typeof updateWorkspaceSchema>) => {
    const confirmValues = {
      ...values,
      image: values.image instanceof File ? values.image : ""
    };
    updateWorkspace(
      { form: confirmValues, param: { workspaceId: initialValues.id } },
      {
        onSuccess: ({ data }) => {
          form.reset();
          onCancel?.();

          if (data) router.push(`/workspaces/${data.id}`);
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

    deleteWorkspace(
      { param: { workspaceId: initialValues.id } },
      {
        onSuccess: () => {
          router.push(`/`);
          router.refresh();
        }
      }
    );
  };

  const handleResetInviteCode = async () => {
    const ok = await confirmResetInviteCode();

    if (!ok) return;

    resetInviteCodeWorkspace(
      {
        param: { workspaceId: initialValues.id }
      },
      {
        onSuccess: () => {
          router.refresh();
        }
      }
    );
  };

  const fullInviteLink = useMemo(() => {
    if (typeof window === "undefined") return "";

    return `${window.location.origin}/workspaces/${initialValues.id}/join/${initialValues.inviteCode}`;
  }, [initialValues]);

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(fullInviteLink).then(() => {
      toast.success("Invite link copied to clipboard");
    });
  };

  return (
    <div className="flex flex-col gap-y-4">
      <DeleteDialog />
      <ResetInviteCodeDialog />
      <Card className="w-full h-full border border-neutral-800 dark:border-neutral-600">
        <CardHeader className="flex p-7">
          <CardTitle className="text-xl font-bold">
            {initialValues.name}
          </CardTitle>
        </CardHeader>
        <div className="px-7">
          <Separator />
        </div>

        <CardContent className="p-7">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workspace Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter workspace name" />
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
                              alt="workspace-image"
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
                          <p className="text-sm font-medium">Workspace Icon</p>
                          <p className="text-sm text-muted-foreground">
                            Update the icon that represents your workspace
                          </p>
                          <input
                            className="hidden"
                            type="file"
                            accept=".jpg, .png, .jpeg, .svg"
                            ref={inputRef}
                            onChange={handleImageChange}
                            disabled={isUpdatePending}
                          />
                          {field.value ? (
                            <Button
                              type="button"
                              disabled={
                                isUpdatePending ||
                                isDeletePending ||
                                isResetInviteCodePending
                              }
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
                              disabled={
                                isUpdatePending ||
                                isDeletePending ||
                                isResetInviteCodePending
                              }
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
                  disabled={
                    isUpdatePending ||
                    isDeletePending ||
                    isResetInviteCodePending
                  }
                  type="submit"
                  size="sm"
                >
                  {isUpdatePending ? <Loader /> : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>

        {/* delete workspace */}
      </Card>

      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold text-lg">Invite Members</h3>
            <p className="text-sm text-muted-foreground">
              Share the invite link below to invite members to this workspace
            </p>
            <div className="mt-4">
              <div className="flex items-center gap-x-2">
                <Input readOnly value={fullInviteLink} />
                <Button
                  variant="secondary"
                  disabled={
                    isUpdatePending ||
                    isDeletePending ||
                    isResetInviteCodePending
                  }
                  className="size-12"
                  onClick={handleCopyInviteLink}
                >
                  <CopyIcon />
                </Button>
              </div>
            </div>
            <Separator className="mt-8" />
            <Button
              className="mt-6 w-fit ml-auto"
              size="sm"
              variant="teritary"
              type="button"
              disabled={
                isUpdatePending || isDeletePending || isResetInviteCodePending
              }
              onClick={handleResetInviteCode}
            >
              Reset Invite Link
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold text-lg text-red-600 dark:text-red-700">
              Danger Zone
            </h3>
            <p className="text-sm text-muted-foreground">
              Once you delete a workspace, it cannot be recovered. Please be
              certain
            </p>
            <Separator className="mt-8" />
            <Button
              className="mt-6 w-fit ml-auto"
              size="sm"
              variant="destructive"
              type="button"
              disabled={
                isUpdatePending || isDeletePending || isResetInviteCodePending
              }
              onClick={handleDelete}
            >
              Delete Workspace
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditWorkspaceForm;
