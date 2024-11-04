import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/api";

export const useGetUser = () => {
  const query = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await client.api.users.$get();

      if (!response.ok) throw new Error("Failed to get user");

      return await response.json();
    }
  });

  return query;
};
