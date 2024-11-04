import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/api";

import { ErrorResponse } from "@/types";

type RequestType = InferRequestType<
  (typeof client.api.members)[":memberId"]["$delete"]
>;

type ResponseType = InferResponseType<
  (typeof client.api.members)[":memberId"]["$delete"],
  200
>;

export const useRemoveMember = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.members[":memberId"]["$delete"]({
        param
      });

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json();
        const errorMessage = errorData.error || "Failed to remove member";

        throw new Error(errorMessage);
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Member has been removed");

      queryClient.invalidateQueries({
        queryKey: ["members"]
      });
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  return mutation;
};
