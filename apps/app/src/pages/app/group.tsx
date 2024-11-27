import { useContext, useMemo } from "react";
import { Can } from "@casl/react";
import { AbilityContext } from "@app/lib/casl";
import { useParams, useSearchParams } from "react-router-dom";
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
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page") || "1");
  const searchTitle = searchParams.get("title") || "";

  const { data, isLoading, isError, refetch } = trpc.lists.getAll.useQuery(
    {
      item: {
        groupId: parseInt(groupId!),
        title: searchTitle || undefined,
      },
      page: currentPage,
      limit: 6,
    },
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  const totalPages = useMemo(
    () => (data?.total ? Math.ceil(data.total / data.limit) : 1),
    [data]
  );

  const handleSearchByTitle = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newTitle = formData.get("title") as string;
    setSearchParams({ title: newTitle, page: "1" });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({ title: searchTitle, page: newPage.toString() });
  };

  if (isLoading) {
    return <div className="text-center py-8">Carregando listas...</div>;
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="mb-4">
          Ocorreu um erro ao carregar as listas. Tente novamente.
        </p>
        <Button onClick={() => refetch()}>Recarregar</Button>
      </div>
    );
  }

  const hasLists = data?.total > 0;
  const hasFilteredResults = data?.items.length > 0;

  return (
    <div className="w-full max-w-screen-lg mx-auto space-y-8">
      {hasLists && (
        <div className="flex justify-between items-center gap-4">
          <form onSubmit={handleSearchByTitle} className="flex flex-1 gap-2">
            <Input
              type="search"
              name="title"
              id="title"
              placeholder="Buscar listas..."
              defaultValue={searchTitle}
              className="flex-grow"
            />
            <Button size="icon" type="submit">
              <Search />
            </Button>
          </form>
          <Can ability={ability}  I="create" a="List">
            <NewListForm />
          </Can>
        </div>
      )}

      {hasLists ? (
        hasFilteredResults ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.items.map((item) => (
              <ListCard
                key={item.id}
                createdAt={new Date(item.createdAt)}
                description={item.description}
                ownerName={item.owner.name}
                title={item.title}
              />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center min-h-[300px]">
            <p className="text-center text-gray-500">
              Nenhuma lista encontrada com o título "{searchTitle}".
            </p>
          </div>
        )
      ) : (
        <div className="flex justify-center items-center min-h-[300px]">
          <EmptyList ability={ability} />
        </div>
      )}

      {hasLists && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          goToPage={handlePageChange}
          totalPages={totalPages}
        />
      )}
    </div>
  );
}
