import { z } from "zod";
import { Edit } from "lucide-react";
import { toast } from "sonner";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Dialog,
} from "@app/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@app/components/ui/form";
import { Input } from "@app/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { Textarea } from "@app/components/ui/textarea";
import { Button } from "@app/components/ui/button";
import { trpc } from "@app/lib/trpc";
import { useEffect, useState } from "react";
import { ListProps } from "@app/components/list-card";
import { listFormSchema } from "./new-list-form";

export function EditListForm({
  id,
  title,
  description,
  createdAt,
  ownerName,
}: ListProps) {
  const utils = trpc.useUtils();
  const { groupId } = useParams<{ groupId: string }>();
  const [open, setOpen] = useState(false);
  const editListMutation = trpc.lists.update.useMutation();

  const form = useForm<z.infer<typeof listFormSchema>>({
    resolver: zodResolver(listFormSchema),
    defaultValues: {
      title: title || "",
      description: description || "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({ title, description }); // Reseta o formulário com os valores atuais da lista
    }
  }, [open, form, title, description]);

  async function onSubmit(values: z.infer<typeof listFormSchema>) {
    if (!groupId) {
      toast.error("Grupo não selecionado.", {
        description: "Selecione um grupo antes de editar uma lista.",
      });
      return;
    }

    try {
      await editListMutation.mutateAsync({
        id,
        ...values,
        groupId: parseInt(groupId),
      });

      toast.success("Lista atualizada com sucesso!", {
        description: `A lista "${values.title}" foi atualizada.`,
      });

      await utils.lists.getAll.invalidate();
      setOpen(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao atualizar a lista.";
      toast.error("Não foi possível atualizar a lista.", {
        description: message,
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          disabled={editListMutation.isLoading}
          className="flex items-center"
        >
          <Edit />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Lista</DialogTitle>
          <DialogDescription>
            Atualize as informações da lista. Certifique-se de preencher todos
            os campos.
          </DialogDescription>
        </DialogHeader>
        <div className="mb-4 text-sm text-muted-foreground">
          <p>
            <strong>Autor:</strong> {ownerName}
          </p>
          <p>
            <strong>Criada em:</strong>{" "}
            {new Date(createdAt).toLocaleDateString()}
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título da Lista</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Ex.: Lista de presentes de Natal"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      className="resize-none"
                      placeholder="Adicione detalhes importantes para o grupo."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Essa mensagem será exibida na lista.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="submit"
                disabled={
                  form.formState.isSubmitting || editListMutation.isLoading
                }
              >
                {form.formState.isSubmitting || editListMutation.isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Atualizar"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
