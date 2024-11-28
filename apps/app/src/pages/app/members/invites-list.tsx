import { useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, Trash2Icon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@app/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@app/components/ui/table";
import { Card, CardContent } from "@app/components/ui/card";
import { trpc } from "@app/lib/trpc";
import { Can } from "@casl/react";
import { AbilityContext } from "@app/lib/casl";

const INVITES_PER_PAGE = 8;

export function InviteList() {
  const ability = useContext(AbilityContext);
  const utils = trpc.useUtils();
  const navigate = useNavigate();
  const { groupId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingInviteId, setLoadingInviteId] = useState<number | null>(null);

  if (!groupId) {
    navigate("/");
    return <div>Redirecionando...</div>;
  }

  const groupIdNumber = parseInt(groupId);

  const { mutateAsync: cancelInvite } = trpc.groups.cancelInvite.useMutation();
  const { data, isLoading } = trpc.groups.listInvites.useQuery({
    groupId: groupIdNumber,
    page: currentPage,
    limit: INVITES_PER_PAGE,
  });

  const totalPages = data?.total ? Math.ceil(data.total / INVITES_PER_PAGE) : 1;

  const handleCancelInvite = async (inviteId: number) => {
    try {
      setLoadingInviteId(inviteId);
      await cancelInvite({ inviteId, groupId: groupIdNumber });
      await utils.groups.listInvites.invalidate();
    } finally {
      setLoadingInviteId(null);
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Card className="w-full  mx-auto">
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">E-mail</TableHead>
              <TableHead>Enviado em</TableHead>
              <Can ability={ability} I="delete" a="Invite">
                <TableHead className="text-right">Ações</TableHead>
              </Can>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : data?.invites.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  Nenhum convite encontrado.
                </TableCell>
              </TableRow>
            ) : (
              data?.invites.map((invite) => (
                <TableRow key={invite.id}>
                  <TableCell className="font-medium">
                    {invite.recipientEmail}
                  </TableCell>
                  <TableCell>
                    {format(new Date(invite.createdAt), "dd/MM/yyyy HH:mm")}
                  </TableCell>
                  <Can ability={ability} I="delete" a="Invite">
                    <TableCell className="text-right">
                      <Button
                        onClick={() => handleCancelInvite(invite.id)}
                        disabled={loadingInviteId === invite.id}
                        variant="destructive"
                        size="sm"
                      >
                        {loadingInviteId === invite.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2Icon className="w-4 h-4" />
                        )}
                        <span className="sr-only">Cancelar convite</span>
                      </Button>
                    </TableCell>
                  </Can>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <div className="flex items-center justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Próximo
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
