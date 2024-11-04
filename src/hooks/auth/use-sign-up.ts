import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { client } from "@/lib/api";

import { ErrorResponse } from "@/types";

type RequestType = InferRequestType<
  (typeof client.api)["sign-up"]["$post"]
>["json"];

type ResponseType = InferResponseType<
  (typeof client.api)["sign-up"]["$post"],
  200
>;

export const useSignUp = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api["sign-up"]["$post"]({ json });

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json();
        const errorMessage = errorData.error || "Failed to sign up";

        throw new Error(errorMessage);
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Thank you, Your account has been created");
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  return mutation;
};
