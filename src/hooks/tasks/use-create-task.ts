import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/api";

import { ErrorResponse } from "@/types";

type ResponseType = InferResponseType<(typeof client.api.tasks)["$post"], 200>;

type RequestType = InferRequestType<(typeof client.api.tasks)["$post"]>;

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.tasks.$post({ json });

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json();
        const errorMessage = errorData.error || "Failed to create task";

        throw new Error(errorMessage);
      }

      return await response.json();
    },

    onSuccess: () => {
      toast.success("Your task has been created");

      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  return mutation;
};
