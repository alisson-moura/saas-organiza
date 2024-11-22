import { createTRPCReact, httpBatchLink } from "@trpc/react-query";
import { AppRouter } from "@server/trpc/@generated/server";
import { env } from "./env";
import { QueryClient } from "@tanstack/react-query";

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: env.VITE_API_URL,
      fetch(url, opts) {
        return fetch(url, {
          ...opts,
          credentials: "include",
        }).then(async response => {
          if(response.status === 401) {
            window.location.href = '/sign-in';
          }
          return response
        })
      },
    }),
  ],
});

export const queryClient = new QueryClient()