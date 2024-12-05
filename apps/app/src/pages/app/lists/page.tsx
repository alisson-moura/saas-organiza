import { trpc } from "@app/lib/trpc";
import { useParams } from "react-router-dom";
import { ItemsTable } from "./items/table";
import { ItemForm } from "./items/new-item";
import { useContext } from "react";
import { Can } from "@casl/react";
import { AbilityContext } from "@app/lib/casl";

export function ListPage() {
  const ability = useContext(AbilityContext);
  const { listId, groupId } = useParams<{ listId: string; groupId: string }>();
  if (!listId || !groupId) {
    return <h1>Nenhuma lista selecionada</h1>;
  }

  const { data } = trpc.lists.get.useQuery({
    id: parseInt(listId),
  });

  return (
    <div className="w-full max-w-screen-lg mx-auto space-y-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{data?.title}</h2>
          <p className="text-muted-foreground">{data?.description}</p>
        </div>
        <Can ability={ability} I="create" a="Item">
          <ItemForm groupId={parseInt(groupId)} listId={parseInt(listId)} />
        </Can>
      </div>
      <div className="mx-auto">
        <ItemsTable listId={parseInt(listId)}/>
      </div>
    </div>
  );
}
