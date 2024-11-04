import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/api";

import { ErrorResponse } from "@/types";

type ResponseType = InferResponseType<
  (typeof client.api.tasks)[":taskId"]["$delete"],
  200
>;

type RequestType = InferRequestType<
  (typeof client.api.tasks)[":taskId"]["$delete"]
>;

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.tasks[":taskId"]["$delete"]({ param });

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json();
        const errorMessage = errorData.error || "Failed to create task";

        throw new Error(errorMessage);
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Task has been deleted");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task", data.id] });
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  return mutation;
};
