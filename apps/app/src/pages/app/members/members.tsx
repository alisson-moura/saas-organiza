import { useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@app/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@app/components/ui/select";
import { Card, CardContent } from "@app/components/ui/card";
import { trpc } from "@app/lib/trpc";
import { Loader2, Trash2Icon } from "lucide-react";
import { Button } from "@app/components/ui/button";
import { useContext, useState, useMemo } from "react";
import { AbilityContext } from "@app/lib/casl";

// Constantes em um local separado
const ITEMS_PER_PAGE = 8;
const MEMBER_ROLES = [
  { value: "Lider", label: "Líder" },
  { value: "Organizador", label: "Organizador" },
  { value: "Participante", label: "Participante" },
  { value: "Observador", label: "Observador" },
] as const;
type MemberRole = (typeof MEMBER_ROLES)[number]["value"];

export function MembersList() {
  const utils = trpc.useUtils();
  const ability = useContext(AbilityContext);
  const { groupId } = useParams<{ groupId: string }>();
  const [currentPage, setCurrentPage] = useState(1);

  const groupIdNumber = parseInt(groupId!);

  // Query com tipagem e opções
  const { data, isLoading } = trpc.groups.listMembers.useQuery(
    {
      item: { groupId: groupIdNumber },
      page: currentPage,
      limit: ITEMS_PER_PAGE,
    },
    {
      // Mantém o último dados em caso de erro
      keepPreviousData: true,
    }
  );

  // Cálculo de páginas usando useMemo
  const totalPages = useMemo(
    () => (data?.total ? Math.ceil(data.total / ITEMS_PER_PAGE) : 1),
    [data?.total]
  );

  // Mutation com tratamento de erro mais robusto
  const changeMemberRoleMutation = trpc.groups.changeMemberRole.useMutation({
    onError: (error) => {
      toast.error("Não conseguimos alterar o papel.", {
        description: error.message || "Aconteceu um erro inesperado.",
      });
    },
    onSuccess: (_, { accountId, role }) => {
      // Atualização otimista do cache
      utils.groups.listMembers.setData(
        {
          item: { groupId: groupIdNumber },
          page: currentPage,
          limit: ITEMS_PER_PAGE,
        },
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            items: oldData.items.map((item) =>
              item.id === accountId ? { ...item, role } : item
            ),
          };
        }
      );
    },
  });

  // Mutation com tratamento de erro
  const removeMemberMutation = trpc.groups.removeMember.useMutation({
    onError: (error) => {
      toast.error("Não conseguimos remover o membro.", {
        description: error.message || "Aconteceu um erro inesperado.",
      });
    },
    onSuccess: (_, { memberId }) => {
      // Atualização otimista do cache
      utils.groups.listMembers.setData(
        {
          item: { groupId: groupIdNumber },
          page: currentPage,
          limit: ITEMS_PER_PAGE,
        },
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            items: oldData.items.filter((item) => item.id !== memberId),
          };
        }
      );
    },
  });

  // Função de handler separada
  const handleChangeRole = (memberId: number, role: MemberRole) => {
    changeMemberRoleMutation.mutate({
      accountId: memberId,
      role,
      groupId: groupIdNumber,
    });
  };

  const handleRemoveMember = (memberId: number) => {
    removeMemberMutation.mutate({
      memberId,
      groupId: groupIdNumber,
    });
  };
  const removeMemberIsLoading = (memberId: number) =>
    removeMemberMutation.isLoading &&
    removeMemberMutation.variables?.memberId === memberId;

  // Componente de paginação extraído
  const PaginationControls = () => (
    <div className="flex items-center justify-end space-x-2 mt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setCurrentPage((p) => p - 1)}
        disabled={currentPage === 1}
      >
        Anterior
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setCurrentPage((p) => p + 1)}
        disabled={currentPage === totalPages}
      >
        Próximo
      </Button>
    </div>
  );

  return (
    <Card className="w-full  mx-auto">
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Papel</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : data?.items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  Nenhum membro no grupo.
                </TableCell>
              </TableRow>
            ) : (
              data?.items.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>
                    {ability.can("update", "Member") ? (
                      <Select
                        onValueChange={(value: MemberRole) =>
                          handleChangeRole(member.id, value)
                        }
                        value={member.role}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o papel do membro" />
                        </SelectTrigger>
                        <SelectContent>
                          {MEMBER_ROLES.map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      member.role
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      disabled={
                        ability.cannot("delete", "Member") ||
                        removeMemberIsLoading(member.id)
                      }
                      onClick={() => handleRemoveMember(member.id)}
                      variant="destructive"
                      size="sm"
                    >
                      {removeMemberIsLoading(member.id) ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2Icon className="w-4 h-4" />
                      )}
                      <span className="sr-only">Remover do grupo</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {totalPages > 1 && <PaginationControls />}
      </CardContent>
    </Card>
  );
}
