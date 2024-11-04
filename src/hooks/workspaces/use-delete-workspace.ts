import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/api";

import { ErrorResponse } from "@/types";

type RequestType = InferRequestType<
  (typeof client.api.workspaces)[":workspaceId"]["$delete"]
>;

type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["$delete"],
  200
>;

export const useDeleteWorkspace = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.workspaces[":workspaceId"]["$delete"]({
        param
      });

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json();
        const errorMessage = errorData.error || "Failed to delete workspace";

        throw new Error(errorMessage);
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Workspace has been deleted");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", data.id] });
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  return mutation;
};
