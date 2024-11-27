import { z } from "zod";
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
import { Loader2, PlusCircle } from "lucide-react";
import { useParams } from "react-router-dom";
import { Textarea } from "@app/components/ui/textarea";
import { Button } from "@app/components/ui/button";
import { trpc } from "@app/lib/trpc";
import { useEffect, useState } from "react";

const newListFormSchema = z.object({
  title: z
    .string()
    .min(2, "O título precisa ter pelo menos 2 caracteres.")
    .max(140, "O título pode ter no máximo 140 caracteres."),
  description: z
    .string()
    .min(10, "A descrição precisa ter pelo menos 10 caracteres.")
    .max(340, "A descrição pode ter no máximo 340 caracteres."),
});

export function NewListForm() {
  const utils = trpc.useUtils();
  const { groupId } = useParams<{ groupId: string }>();
  const [open, setOpen] = useState(false);
  const newListMutation = trpc.lists.create.useMutation();

  const form = useForm<z.infer<typeof newListFormSchema>>({
    resolver: zodResolver(newListFormSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  async function onSubmit(values: z.infer<typeof newListFormSchema>) {
    if (!groupId) {
      toast.error("Grupo não selecionado.", {
        description: "Selecione um grupo antes de criar uma lista.",
      });
      return;
    }

    try {
      await newListMutation.mutateAsync({
        ...values,
        groupId: parseInt(groupId),
      });

      toast.success("Lista criada com sucesso!", {
        description: `Sua lista "${values.title}" foi compartilhada com o grupo.`,
      });

      setOpen(false);
      await utils.lists.getAll.invalidate();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao criar a lista.";
      toast.error("Não foi possível criar a lista.", { description: message });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={newListMutation.isLoading}
          className="flex items-center"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Criar nova lista
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nova Lista</DialogTitle>
          <DialogDescription>
            Crie uma nova lista e compartilhe com seu grupo.
          </DialogDescription>
        </DialogHeader>
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
                  form.formState.isSubmitting || newListMutation.isLoading
                }
              >
                {form.formState.isSubmitting || newListMutation.isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Criar"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
