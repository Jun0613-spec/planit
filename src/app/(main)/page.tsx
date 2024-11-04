"use client";

import { useRouter } from "next/navigation";

import Loader from "@/components/loader";

import { useGetUser } from "@/hooks/users/use-get-user";
import { useGetWorkspaces } from "@/hooks/workspaces/use-get-workspaces";

const MainPage = () => {
  const router = useRouter();

  const {
    data: user,
    isLoading: isUserLoading,
    error: userError
  } = useGetUser();

  const { data: workspaces, isLoading: isWorkspacesLoading } =
    useGetWorkspaces();

  const isLoading = isUserLoading || isWorkspacesLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  if (userError || !user) {
    router.push("/sign-in");
  }

  if (!workspaces || workspaces.length === 0) {
    router.push("/workspaces/create");
  } else {
    router.push(`/workspaces/${workspaces[0].id}`);
  }
};

export default MainPage;
