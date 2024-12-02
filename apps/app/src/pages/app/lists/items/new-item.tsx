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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@app/components/ui/select";
import { Input } from "@app/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PlusCircle } from "lucide-react";
import { Textarea } from "@app/components/ui/textarea";
import { Button } from "@app/components/ui/button";
import { TRPCClientError } from "@trpc/react-query";
import { trpc } from "@app/lib/trpc";
import { useState } from "react";

const newItemFormSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().optional(),
  priority: z
    .union([z.literal("high"), z.literal("low"), z.literal("medium")])
    .default("medium"),
  assignedId: z.coerce.number().positive().nullish(),
});
type NewItemForm = z.infer<typeof newItemFormSchema>;

export function ItemForm({
  listId,
  groupId,
}: {
  listId: number;
  groupId: number;
}) {
  const { mutateAsync: addItem } = trpc.lists.addItem.useMutation();
  const { data: members } = trpc.groups.listMembers.useQuery({
    item: { groupId },
  });
  const [open, setOpen] = useState(false);

  const form = useForm<NewItemForm>({
    resolver: zodResolver(newItemFormSchema),
    defaultValues: {
      priority: "medium",
      assignedId: null,
      description: "",
      title: "",
    },
  });

  async function onSubmit(values: NewItemForm) {
    try {
      await addItem({
        listId,
        ...values,
        assignedId: values.assignedId === 0 ? null : values.assignedId,
      });
      toast.success("Item adicionado.", {
        description: `Novo item: ${values.title}`,
      });
      setOpen(false);
    } catch (error) {
      let message = "Aconteceu um erro inesperado.";
      if (error instanceof TRPCClientError || error instanceof Error) {
        message = error.message;
      }
      toast.error("Não conseguimos adicionar o item.", {
        description: message,
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle />
          Item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo item</DialogTitle>
          <DialogDescription>
            Adicione um novo item a sua lista.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="flex gap-4 items-center">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Título do item</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Ex.: Levar o refrigerante zero."
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem className="min-w-[120px]">
                    <FormLabel>Prioridade</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={"medium"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Prioridade do item" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="high">Alta</SelectItem>
                        <SelectItem value="medium">Média</SelectItem>
                        <SelectItem value="low">Baixa</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            {members && (
              <FormField
                control={form.control}
                name="assignedId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Atribuido para:</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={"0"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Membros" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0">Ninguém</SelectItem>
                        {members.items.map((member) => (
                          <SelectItem
                            key={`${member.id}`}
                            value={`${member.id}`}
                          >
                            {member.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            )}
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
                    A descrição é opcional, mas é sempre bom fornecer detalhes.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Adicionar"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
