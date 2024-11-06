"use client";

import React, { ChangeEvent, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { AlertTriangleIcon, ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";

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

import { updateUserSchema } from "@/lib/zod";

import { useConfirm } from "@/hooks/use-confirm";

import { useUpdateUser } from "@/hooks/users/use-update-user";
import { useDeleteUser } from "@/hooks/users/use-delete-user";

import { useGetUser } from "@/hooks/users/use-get-user";

interface EditUserProfileFormProps {
  onCancel?: () => void;
}

const EditUserProfileForm = ({ onCancel }: EditUserProfileFormProps) => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const { data } = useGetUser();

  const { mutate: updateUser, isPending: isUpdatePending } = useUpdateUser();
  const { mutate: deleteUser, isPending: isDeletePending } = useDeleteUser();

  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete Account",
    "This will permanently delete the account. Are you sure you want to proceed?"
  );

  const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: data?.data.name || "",
      image: data?.data.image || ""
    }
  });

  const onSubmit = (values: z.infer<typeof updateUserSchema>) => {
    const confirmValues = {
      ...values,
      image: values.image instanceof File ? values.image : ""
    };

    updateUser(
      { form: confirmValues },
      {
        onSuccess: async () => {
          form.reset();
          onCancel?.();
          router.refresh();
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

    deleteUser({
      onSuccess: () => {
        onCancel?.();
      }
    });
  };

  if (!data)
    return (
      <div className="h-screen flex flex-col gap-y-4 items-center justify-center">
        <AlertTriangleIcon className="size-6" />
        <p className="text-sm ">No user found</p>
      </div>
    );

  return (
    <div className="flex flex-col gap-y-4">
      <DeleteDialog />

      <Card className="w-full h-full border border-neutral-800 dark:border-neutral-600">
        <CardHeader className="flex p-7">
          <CardTitle className="text-xl font-bold">Profile Setting</CardTitle>

          <CardDescription>Manage {data?.data.name} profile</CardDescription>
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
                  name="image"
                  render={({ field }) => (
                    <div className="flex flex-col gap-y-2">
                      <div className="flex items-center gap-x-5">
                        {field.value ? (
                          <div className="size-20 relative rounded-full overflow-hidden">
                            <Image
                              alt="profile-image"
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
                          <Avatar className="size-20">
                            <AvatarFallback>
                              <ImageIcon className="size-10 text-neutral-400 dark:text-neutral-500" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex flex-col">
                          <p className="text-sm font-medium">Profile Image</p>
                          <p className="text-sm text-muted-foreground">
                            Update user profile image
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

                                form.setValue("image", "");
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

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter user name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
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
      </Card>

      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold text-lg text-red-600 dark:text-red-700">
              Danger Zone
            </h3>
            <p className="text-sm text-muted-foreground">
              Once you delete an account, it cannot be recovered. Please be
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
              Delete account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditUserProfileForm;
