"use client";

import React, { Fragment } from "react";
import { MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import MemberAvatar from "../../../../components/members/member-avatar";
import MembersListSkeleton from "./member-list-skeleton";

import { useGetMembers } from "@/hooks/members/use-get-members";
import { useWorkspaceId } from "@/hooks/workspaces/use-workspace-id";
import { useRemoveMember } from "@/hooks/members/use-remove-member";
import { useUpdateMember } from "@/hooks/members/use-update-member";
import { useConfirm } from "@/hooks/use-confirm";

import { MemberRole } from "@/types";

const MemberList = () => {
  const router = useRouter();

  const workspaceId = useWorkspaceId();
  const { data = [], isLoading } = useGetMembers({ workspaceId });
  const { mutate: updateMember, isPending: isUpdatingMember } =
    useUpdateMember();
  const { mutate: removeMember, isPending: isRemovingMember } =
    useRemoveMember();

  const [UpdateDialog, confirmUpdate] = useConfirm(
    "Change member role",
    "Are you sure you want to change this member role?"
  );

  const [RemoveDialog, confirmDelete] = useConfirm(
    "Remove member",
    "Are you sure you want to remove this member from the workspace?"
  );

  const handleUpdateMember = async (memberId: string, role: MemberRole) => {
    const confirm = await confirmUpdate();
    if (!confirm) return;

    updateMember(
      { json: { role }, param: { memberId } },
      {
        onSuccess: () => {
          router.refresh();
        }
      }
    );
  };

  const onHandleRemoveMember = async (memberId: string) => {
    const confirm = await confirmDelete();
    if (!confirm) return;

    removeMember(
      { param: { memberId } },
      {
        onSuccess: () => {
          router.refresh();
        }
      }
    );
  };

  if (isLoading) {
    return <MembersListSkeleton />;
  }

  return (
    <>
      <UpdateDialog />
      <RemoveDialog />
      <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="flex p-7">
          <CardTitle className="text-xl font-bold">Members list</CardTitle>
        </CardHeader>
        <div className="px-7">
          <Separator />
        </div>
        <CardContent className="p-7">
          {data?.map((member, index) => (
            <Fragment key={member.id}>
              <div className="flex items-center gap-2">
                <MemberAvatar
                  className="size-10"
                  fallbackClassName="size-10"
                  name={member.name || ""}
                  image={member.image || ""}
                />
                <div className="flex flex-col">
                  <p className="text-sm font-medium">{member.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {member.email}
                  </p>
                  <p className="text-xs font-medium text-neutral-600 dark:text-neutral-300 ">
                    {member.role === "ADMIN" ? "Admin" : "Member"}
                  </p>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      disabled={false}
                      variant="ghost"
                      size="icon"
                      className="ml-auto hover:opacity-60"
                    >
                      <MoreVertical className="size-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="bottom" align="end">
                    <DropdownMenuItem
                      className="font-medium "
                      onClick={() =>
                        handleUpdateMember(member.id, MemberRole.ADMIN)
                      }
                      disabled={isRemovingMember || isUpdatingMember}
                    >
                      Set to Admin
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="font-medium "
                      onClick={() =>
                        handleUpdateMember(member.id, MemberRole.MEMBER)
                      }
                      disabled={isRemovingMember || isUpdatingMember}
                    >
                      Set to Member
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="font-medium  text-red-600 focus:text-white  focus:bg-red-600  dark:text-red-700  dark:focus:text-white dark:focus:bg-red-700"
                      onClick={() => onHandleRemoveMember(member.id)}
                      disabled={isRemovingMember || isUpdatingMember}
                    >
                      Remove User
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {index < data.length - 1 && <Separator className="my-2.5" />}
            </Fragment>
          ))}
        </CardContent>
      </Card>
    </>
  );
};

export default MemberList;
