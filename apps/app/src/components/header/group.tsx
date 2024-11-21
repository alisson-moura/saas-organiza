import { z } from "zod";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { TRPCClientError } from "@trpc/client";

const updateProfileFormSchema = z.object({
  name: z
    .string()
    .min(8, { message: "O nome precisa ter pelo menos 2 caracteres." })
    .max(140, { message: "O nome pode ter no máximo 140 caracteres." }),
  description: z
    .string({ message: "A descrição do grupo é obrigatória." })
    .min(20, {
      message: "A descrição do grupo precisa ter ao menos 20 caracteres.",
    })
    .max(140, { message: "A descrição pode ter no máximo 140 caracteres." }),
});

export function DialogGroup() {
  const form = useForm<z.infer<typeof updateProfileFormSchema>>({
    resolver: zodResolver(updateProfileFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof updateProfileFormSchema>) {
    try {
      console.log(values);
    } catch (error) {
      console.log(error);
      let message = "Aconteceu um erro inesperado.";
      if (error instanceof TRPCClientError) {
        message = error.message;
      }
      toast.error("Não conseguimos criar o grupo.", {
        description: message,
      });
    }
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Novo grupo</DialogTitle>
        <DialogDescription>
          Crie um novo grupo e convide seus amigos.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do grupo</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Nome do seu grupo, seja criativo"
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
                  <Textarea className="resize-none" {...field} />
                </FormControl>
                <FormDescription>
                  Essa descrição será exibida nos convites.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter>
            <Button disabled={form.formState.isSubmitting} type="submit">
              {form.formState.isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Criar grupo"
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
