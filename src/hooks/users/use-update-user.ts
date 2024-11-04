import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { client } from "@/lib/api";

import { ErrorResponse } from "@/types";

type RequestType = InferRequestType<(typeof client.api.users)["$patch"]>;

type ResponseType = InferResponseType<(typeof client.api.users)["$patch"], 200>;

export const useUpdateUser = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const response = await client.api.users["$patch"]({
        form
      });

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json();
        const errorMessage = errorData.error || "Failed to update user";

        throw new Error(errorMessage);
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("User has been updated");

      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  return mutation;
};
