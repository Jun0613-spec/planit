import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/api";

import { ErrorResponse } from "@/types";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

type RequestType = InferRequestType<(typeof client.api.users)["$delete"]>;

type ResponseType = InferResponseType<
  (typeof client.api.users)["$delete"],
  200
>;

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async () => {
      const response = await client.api.users["$delete"]();

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json();
        const errorMessage = errorData.error || "Failed to delete user";

        throw new Error(errorMessage);
      }

      return await response.json();
    },
    onSuccess: async () => {
      toast.success("User has been deleted");
      await signOut();
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  return mutation;
};
