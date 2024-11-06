"use client";

import { signOut } from "next-auth/react";
import { LogOut, SettingsIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import Loader from "./loader";
import { Button } from "./ui/button";

import { useGetUser } from "@/hooks/users/use-get-user";

import { useEditUserProfileModalStore } from "@/stores/modal-store";

const UserButton = () => {
  const { onOpen } = useEditUserProfileModalStore();

  const { data, isLoading } = useGetUser();

  if (isLoading) return <Loader />;

  if (!data) {
    return (
      <>
        <p>User not found</p>
        <Button variant="destructive" onClick={() => signOut()}>
          Sign out
        </Button>
      </>
    );
  }

  const { name, email, image } = data?.data;

  const avatarFallback = name
    ? name.charAt(0).toUpperCase()
    : email?.charAt(0).toUpperCase();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="outline-none relative">
        <Avatar className="size-9 transition">
          <AvatarImage
            alt={name || ""}
            src={image || ""}
            className="hover:opacity-80 object-cover"
          />
          <AvatarFallback className="font-medium text-white bg-sky-500 dark:bg-sky-600 hover:bg-sky-500/80 dark:hover:bg-sky-600/80 flex items-center justify-center text-lg">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="bottom"
        className="w-60 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600"
        sideOffset={10}
      >
        <div className="flex flex-col items-center justify-center gap-2 px-2.5 py-4">
          <Avatar className="size-14 transition">
            <AvatarImage
              alt={name || "User Avatar"}
              src={image || ""}
              className="object-cover"
            />
            <AvatarFallback className="font-medium text-white bg-sky-500 dark:bg-sky-600  flex items-center justify-center text-xl cursor-default">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center justify-center">
            <p className="flex items-center  text-base font-medium text-neutral-900 dark:text-white">
              {name}
              <Button
                onClick={onOpen}
                variant="ghost"
                size="icon"
                className="hover:opacity-60"
              >
                <SettingsIcon className="size-4 ml-2" />
              </Button>
            </p>

            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {email}
            </p>
          </div>
        </div>

        <DropdownMenuSeparator className="mb-1 bg-neutral-300 dark:bg-neutral-600" />

        <DropdownMenuItem
          onClick={async () => await signOut()}
          className="h-10 flex items-center justify-center text-red-600 dark:text-red-700 font-medium cursor-pointer focus:bg-red-600 focus:text-white dark:focus:bg-red-800 dark:focus:text-neutral-100"
        >
          <LogOut className="size-4 mr-2" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
