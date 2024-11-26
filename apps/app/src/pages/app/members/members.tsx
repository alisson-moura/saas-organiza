import { useParams, useNavigate } from "react-router-dom";
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
import { Loader2, Trash2Icon } from "lucide-react";
import { Button } from "@app/components/ui/button";
import { useState } from "react";

const ITEMS_PER_PAGE = 8;

export function MembersList() {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);

  if (!groupId) {
    navigate("/");
    return <div>Redirecionando...</div>;
  }
  const groupIdNumber = parseInt(groupId);
  const { data, isLoading } = trpc.groups.listMembers.useQuery({
    item: { groupId: groupIdNumber },
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  });

  const totalPages = data?.total
  ? Math.ceil(data.total / ITEMS_PER_PAGE)
  : 1;

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
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
                <TableCell colSpan={3} className="text-center">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : data?.items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  Nenhum membro no grupo.
                </TableCell>
              </TableRow>
            ) : (
              data?.items.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="destructive" size="sm">
                      <Trash2Icon className="w-4 h-4" />
                      <span className="sr-only">Remover do grupo</span>
                    </Button>
                  </TableCell>
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
