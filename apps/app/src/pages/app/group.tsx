import { useContext, useMemo, useState } from "react";
import { AbilityContext } from "@app/lib/casl";
import { useParams } from "react-router-dom";
import { trpc } from "@app/lib/trpc";
import { EmptyList } from "@app/components/empty-list";
import { ListCard } from "@app/components/list-card";
import { Input } from "@app/components/ui/input";
import { Button } from "@app/components/ui/button";
import { Search } from "lucide-react";
import { NewListForm } from "./lists/new-list-form";
import { Pagination } from "@app/components/pagination";

export function GroupPage() {
  const ability = useContext(AbilityContext);
  const { groupId } = useParams<{ groupId: string }>();
  const [currentPage, setCurrentPage] = useState(1);

  const getListQuery = trpc.lists.getAll.useQuery({
    item: {
      groupId: parseInt(groupId!),
    },
    page: currentPage,
    limit: 6
  });
  // Cálculo de páginas usando useMemo
  const totalPages = useMemo(
    () =>
      getListQuery.data?.total
        ? Math.ceil(getListQuery.data.total / getListQuery.data?.limit)
        : 1,
    [getListQuery.data?.limit, getListQuery.data?.total]
  );

  if (!getListQuery.data || getListQuery.data.items.length < 1) {
    return <EmptyList ability={ability} />;
  }

  return (
    <div className="container mx-auto space-y-8 p-4">
      <div className="flex justify-between items-center gap-8">
        <form className="flex flex-1 gap-2">
          <Input
            type="search"
            placeholder="Buscar listas..."
            className="flex-grow"
          />
          <Button size="icon" type="submit">
            <Search />
          </Button>
        </form>
        <NewListForm />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {getListQuery.data?.items.map((item) => (
          <ListCard
            key={item.id}
            createdAt={new Date(item.createdAt)}
            description={item.description}
            ownerName={item.owner.name}
            title={item.title}
          />
        ))}
      </div>
      {getListQuery.data.limit < getListQuery.data.total && (
        <Pagination
          currentPage={currentPage}
          goToPage={setCurrentPage}
          totalPages={totalPages}
        />
      )}
    </div>
  );
}
