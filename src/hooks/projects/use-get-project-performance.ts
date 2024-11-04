import { InferResponseType } from "hono";
import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/api";

interface useGetProjectPerformanceProps {
  projectId: string;
}

export type ProjectPerformanceResponseType = InferResponseType<
  (typeof client.api.projects)[":projectId"]["performance"]["$get"],
  200
>;

export const useGetProjectPerformance = ({
  projectId
}: useGetProjectPerformanceProps) => {
  const query = useQuery({
    queryKey: ["project-performance", projectId],
    queryFn: async () => {
      const response = await client.api.projects[":projectId"][
        "performance"
      ].$get({
        param: { projectId }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch project performance");
      }

      const { data } = await response.json();
      return data;
    }
  });

  return query;
};
