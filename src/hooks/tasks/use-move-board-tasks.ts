import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/api";

import { ErrorResponse } from "@/types";

type ResponseType = InferResponseType<
  (typeof client.api.tasks)["move-board"]["$post"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.tasks)["move-board"]["$post"]
>;

export const useMoveBoardTasks = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.tasks["move-board"]["$post"]({
        json
      });

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json();
        const errorMessage = errorData.error || "Failed to updated task";

        throw new Error(errorMessage);
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Task has been updated");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  return mutation;
};
