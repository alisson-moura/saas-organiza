import { Header } from "@app/components/header/header";
import { trpc } from "@app/lib/trpc";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export function AppLayout() {
  const navigate = useNavigate();
  const { data: isAuthenticated, isLoading } = trpc.auth.check.useQuery();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/sign-in'); // Aqui o `useNavigate` funciona normalmente
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col antialiased">
      <Header />
      <div className="flex flex-1 flex-col gap-4 p-8 pt-4">
        <Outlet />
      </div>
    </div>
  );
}
