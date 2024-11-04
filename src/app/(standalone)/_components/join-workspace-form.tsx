"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

import { useJoinWorkspace } from "@/hooks/workspaces/use-join-workspace";
import { useInviteCode } from "@/hooks/workspaces/use-invite-code";
import { useWorkspaceId } from "@/hooks/workspaces/use-workspace-id";
import { Separator } from "@/components/ui/separator";

interface JoinWorkspaceForm {
  initialValues: {
    name: string;
  };
}

const JoinWorkspaceForm = ({ initialValues }: JoinWorkspaceForm) => {
  const { mutate, isPending } = useJoinWorkspace();

  const inviteCode = useInviteCode();
  const workspaceId = useWorkspaceId();

  const router = useRouter();

  const onSubmit = () => {
    mutate(
      { param: { workspaceId }, json: { code: inviteCode } },
      {
        onSuccess: ({ data }) => {
          router.push(`/workspaces/${data.id}`);
        }
      }
    );
  };

  return (
    <Card className="h-full w-full border-none shadow-none">
      <CardHeader className="p-7">
        <CardTitle className="text-xl font-bold">Join workspace</CardTitle>
        <CardDescription>
          You&apos;ve been invited to join the workspace{" "}
          <strong>{initialValues.name}</strong>
        </CardDescription>
      </CardHeader>
      <div className="px-7">
        <Separator />
      </div>
      <CardContent className="p-7">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-2">
          <Button
            className="w-full lg:w-fit"
            variant="destructive"
            type="button"
            size="lg"
            asChild
            disabled={isPending}
          >
            <Link href="/">Cancel</Link>
          </Button>
          <Button
            variant="primary"
            size="lg"
            type="button"
            className="w-full lg:w-fit"
            onClick={onSubmit}
            disabled={isPending}
          >
            Join workspace
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JoinWorkspaceForm;
