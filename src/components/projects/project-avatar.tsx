import React from "react";
import Image from "next/image";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { cn } from "@/lib/utils";

interface ProjectAvatarProps {
  name: string;
  image?: string;
  className?: string;
  fallbackClassName?: string;
}

const ProjectAvatar = ({
  name,
  image,
  className,
  fallbackClassName
}: ProjectAvatarProps) => {
  return (
    <>
      {image ? (
        <div
          className={cn(
            "size-5 relative rounded-md overflow-hidden",
            className
          )}
        >
          <Image src={image} alt={name} className="object-cover" fill />
        </div>
      ) : (
        <Avatar className={cn("size-5 rounded-md", className)}>
          <AvatarFallback
            className={cn(
              "text-white bg-sky-600 dark:bg-sky-700 font-semibold text-sm rounded-md",
              fallbackClassName
            )}
          >
            {name[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
    </>
  );
};

export default ProjectAvatar;
