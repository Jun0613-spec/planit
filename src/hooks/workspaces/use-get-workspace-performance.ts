import { InferResponseType } from "hono";
import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/api";

interface useGetWorkspacePerformanceProps {
  workspaceId: string;
}

export type WorkspacePerformanceResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["performance"]["$get"],
  200
>;

export const useGetWorkspacePerformance = ({
  workspaceId
}: useGetWorkspacePerformanceProps) => {
  const query = useQuery({
    queryKey: ["workspace-performance", workspaceId],
    queryFn: async () => {
      const response = await client.api.workspaces[":workspaceId"][
        "performance"
      ].$get({
        param: { workspaceId }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch a workspace performance");
      }

      const { data } = await response.json();

      return data;
    }
  });

  return query;
};
