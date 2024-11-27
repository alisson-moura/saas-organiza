import { useContext } from "react";
import { PlusCircle, Lock } from "lucide-react";
import { Can } from "@casl/react";
import { AbilityContext } from "@app/lib/casl";
import { NewListForm } from "./lists/new-list-form";

export function GroupPage() {
  const ability = useContext(AbilityContext);

  return (
    <div className="flex flex-col items-center justify-center h-[50vh] p-8 text-center">
      <div className="mb-4">
        <PlusCircle className="h-12 w-12 text-gray-400" />
      </div>
      <h2 className="text-2xl font-semibold mb-2">Nenhuma lista criada</h2>
      <Can ability={ability} I="create" a="List">
        <p className="text-muted-foreground mb-6 max-w-md">
          Parece que você ainda não criou nenhuma lista. Comece criando sua
          primeira lista agora!
        </p>
        <NewListForm />
      </Can>
      <Can ability={ability} not I="create" a="List">
        <p className="text-muted-foreground mb-6 max-w-md">
          Nenhuma lista foi criada neste grupo. Aguarde que um administrador
          crie uma lista para você.
        </p>
        <Lock className="h-8 w-8 text-gray-400" />
      </Can>
    </div>
  );
}
