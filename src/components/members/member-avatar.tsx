import React from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { cn } from "@/lib/utils";
import Image from "next/image";

interface MemberAvatarProps {
  name: string;
  image?: string;
  className?: string;
  fallbackClassName?: string;
}

const MemberAvatar = ({
  name,
  image,
  className,
  fallbackClassName
}: MemberAvatarProps) => {
  return (
    <>
      {image ? (
        <div
          className={cn(
            "size-10 relative overflow-hidden transition rounded-full",
            className
          )}
        >
          <Image src={image} alt={name} fill className=" object-cover" />
        </div>
      ) : (
        <Avatar
          className={cn("size-10 transition rounded-full", fallbackClassName)}
        >
          <AvatarFallback
            className={cn(
              "text-white bg-sky-600 dark:bg-sky-700 font-medium text-xl flex items-center justify-center",
              fallbackClassName
            )}
          >
            {name[0].charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
    </>
  );
};

export default MemberAvatar;
