import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { client } from "@/lib/api";

import { ErrorResponse } from "@/types";

type RequestType = InferRequestType<
  (typeof client.api.workspaces)[":workspaceId"]["$patch"]
>;

type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["$patch"],
  200
>;

export const useUpdateWorkspace = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form, param }) => {
      const response = await client.api.workspaces[":workspaceId"]["$patch"]({
        form,
        param
      });

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json();
        const errorMessage = errorData.error || "Failed to update workspace";

        throw new Error(errorMessage);
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success(`Workspace "${data.name}" has been updated`);
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", data.id] });
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  return mutation;
};
