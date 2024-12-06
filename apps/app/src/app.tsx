import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@app/components/theme/theme-provider";
import { Toaster } from "@app/components/ui/sonner";
import { router } from "./routes";
import { queryClient, trpc, trpcClient } from "@app/lib/trpc";
import { QueryClientProvider } from "@tanstack/react-query";

export function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="organiza-theme">
      <Toaster />
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </trpc.Provider>
    </ThemeProvider>
  );
}
