import React from "react";
import { SettingsIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import MemberAvatar from "@/components/members/member-avatar";

import { useWorkspaceId } from "@/hooks/workspaces/use-workspace-id";

import { Member } from "@/types";

interface MembersListProps {
  data: Member[];
  total: number;
}

const MembersList = ({ data, total }: MembersListProps) => {
  const workspaceId = useWorkspaceId();

  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-white dark:bg-muted border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Members ({total})</p>
          <Button variant="secondary" size="icon" asChild>
            <Link href={`/workspaces/${workspaceId}/members`}>
              <SettingsIcon className="size-4 text-neutral-600 dark:text-neutral-200" />
            </Link>
          </Button>
        </div>

        <Separator className="my-4" />

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((member) => (
            <li key={member.id}>
              <Card className="dark:bg-muted shadow-none border rounded-lg hover:opacity-75 transition overflow-hidden">
                <CardContent className="p-4 flex flex-col items-center gap-x-2">
                  <MemberAvatar
                    name={member.name}
                    image={member.image || ""}
                    className="size-12"
                    fallbackClassName="size-12 text-2xl"
                  />
                  <div className="flex flex-col items-center overflow-hidden">
                    <p className="text-lg font-medium line-clamp-1">
                      {member.name}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {member.email}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            No members found
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MembersList;
