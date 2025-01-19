import { QueryClient, DefaultOptions } from "@tanstack/react-query";

const defaultQueryOptions: DefaultOptions = {
  queries: {
    staleTime: 5 * 60 * 1000, // Data remains fresh for 5 minutes
    cacheTime: 30 * 60 * 1000, // Cache kept for 30 minutes
    queryFn: async ({ queryKey }) => {
      const res = await fetch(queryKey[0] as string, {
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status >= 500) {
          throw new Error(`${res.status}: ${res.statusText}`);
        }

        throw new Error(`${res.status}: ${await res.text()}`);
      }

      return res.json();
    },
    refetchInterval: false,
    refetchOnWindowFocus: false,
    retry: false,
  },
  mutations: {
    retry: false,
  },
};

export const queryClient = new QueryClient({
  defaultOptions: defaultQueryOptions,
});
