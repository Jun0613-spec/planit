import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

const MemberListSkeleton = () => {
  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">Members list</CardTitle>
      </CardHeader>

      <div className="px-7">
        <Separator />
      </div>

      <CardContent className="p-7">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Skeleton className="size-10 rounded-full" />
            <div className="flex flex-col gap-1.5">
              <Skeleton className="w-16 h-2 rounded-full" />
              <Skeleton className="w-12 h-2 rounded-full" />
              <Skeleton className="w-12 h-2 rounded-full" />
            </div>
          </div>
          <Skeleton className="size-8 border-neutral-200 dark:border-neutral-400 border rounded-md" />
        </div>

        <Separator className="my-2.5" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Skeleton className="size-10 rounded-full" />
            <div className="flex flex-col gap-1.5">
              <Skeleton className="w-16 h-2 rounded-full" />
              <Skeleton className="w-12 h-2 rounded-full" />
            </div>
          </div>
          <Skeleton className="size-8 border-neutral-200 dark:border-neutral-400 border rounded-md" />
        </div>

        <Separator className="my-2.5" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Skeleton className="size-10 rounded-full" />
            <div className="flex flex-col gap-1.5">
              <Skeleton className="w-16 h-2 rounded-full" />
              <Skeleton className="w-12 h-2 rounded-full" />
            </div>
          </div>
          <Skeleton className="size-8 border-neutral-200 dark:border-neutral-400 border rounded-md" />
        </div>

        <Separator className="my-2.5" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Skeleton className="size-10 rounded-full" />
            <div className="flex flex-col gap-1.5">
              <Skeleton className="w-16 h-2 rounded-full" />
              <Skeleton className="w-12 h-2 rounded-full" />
            </div>
          </div>
          <Skeleton className="size-8 border-neutral-200 dark:border-neutral-400 border rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
};

export default MemberListSkeleton;
