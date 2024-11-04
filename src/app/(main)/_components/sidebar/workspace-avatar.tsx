import React from "react";
import Image from "next/image";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { cn } from "@/lib/utils";

interface WorkspaceAvatarProps {
  name: string;
  image?: string;
  className?: string;
}

const WorkspaceAvatar = ({ name, image, className }: WorkspaceAvatarProps) => {
  return (
    <>
      {image ? (
        <div
          className={cn(
            "size-8 relative rounded-md overflow-hidden",
            className
          )}
        >
          <Image src={image} alt={name} className="object-cover" fill />
        </div>
      ) : (
        <Avatar className={cn("size-8 rounded-md")}>
          <AvatarFallback className="text-white bg-sky-600 dark:bg-sky-700 font-semibold text-lg rounded-md">
            {name[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
    </>
  );
};

export default WorkspaceAvatar;
