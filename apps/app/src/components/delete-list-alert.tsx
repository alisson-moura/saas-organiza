import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@app/components/ui/alert-dialog";
import { Button } from "@app/components/ui/button";
import { trpc } from "@app/lib/trpc";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";

interface DeleteListProps {
  id: number;
}

export function DeleteListAlert({ id }: DeleteListProps) {
  const [open, setOpen] = useState(false);

  const utils = trpc.useUtils();
  const deleteMutation = trpc.lists.delete.useMutation({
    onSuccess: async () => {
      await utils.lists.getAll.invalidate();
      setOpen(false);
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate({
      id,
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Remover lista">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Está ação não pode ser desfeita. Isto irá remover permanentemente os
            dados desta lista.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={deleteMutation.isLoading}
            onClick={() => handleDelete()}
          >
            {deleteMutation.isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Continuar"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
