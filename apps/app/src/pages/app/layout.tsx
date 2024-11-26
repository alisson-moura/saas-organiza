import { Header } from "@app/components/header/header";
import { AbilityContext } from "@app/lib/casl";
import { trpc } from "@app/lib/trpc";
import { useEffect, useMemo } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import defineAbilitiesFor from "@organiza/authorization";

export function AppLayout() {
  const navigate = useNavigate();
  const { data: isAuthenticated, isLoading } = trpc.auth.check.useQuery();
  const { data: groupsData, isLoading: isLoadingGroups } =
    trpc.groups.list.useQuery();

  const { groupId } = useParams();

  // Encontrar o grupo atual usando useMemo para evitar calcular a cada renderização
  const currentGroup = useMemo(() => {
    if (groupId && groupsData?.groups) {
      return groupsData.groups.find((g) => g.group.id === parseInt(groupId));
    }
    return null;
  }, [groupId, groupsData]);

  // Verificar autenticação e redirecionar se não estiver autenticado
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/sign-in");
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Definir habilidades apenas quando o grupo atual existir
  const ability = useMemo(() => {
    if (currentGroup) {
      return defineAbilitiesFor(
        currentGroup.role as never,
        currentGroup.group.id
      );
    }
    return null;
  }, [currentGroup]);

  // Tratar caso de carregamento
  if (isLoading || isLoadingGroups) {
    return <div>Carregando...</div>;
  }


  return (
    <div className="flex min-h-screen flex-col antialiased">
      <Header />
      <AbilityContext.Provider value={ability!}>
        <div className="flex flex-1 flex-col gap-4 p-8 pt-4">
          <Outlet />
        </div>
      </AbilityContext.Provider>
    </div>
  );
}
