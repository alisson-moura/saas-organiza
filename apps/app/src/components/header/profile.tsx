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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { trpc } from "@app/lib/trpc";
import { TRPCClientError } from "@trpc/client";

const updateProfileFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "O nome precisa ter pelo menos 2 caracteres." })
    .max(140, { message: "O nome pode ter no máximo 140 caracteres." }),
  email: z.string().email({ message: "Insira um endereço de e-mail válido." }),
  password: z
    .string()
    .min(6, { message: "A senha precisa ter pelo menos 6 caracteres." })
    .max(20, { message: "A senha pode ter no máximo 20 caracteres." })
    .optional()
    .or(z.literal("")),
});

export function DialogProfile(props: { closeDialog: VoidFunction }) {
  const utils = trpc.useUtils();
  const { data } = trpc.account.me.useQuery();
  const { mutateAsync: updateAccount } = trpc.account.update.useMutation();

  const form = useForm<z.infer<typeof updateProfileFormSchema>>({
    resolver: zodResolver(updateProfileFormSchema),
    defaultValues: {
      email: data?.account.email,
      password: "",
      name: data?.account.name,
    },
  });

  async function onSubmit(values: z.infer<typeof updateProfileFormSchema>) {
    try {
      await updateAccount({
        id: data?.account.id!,
        ...values,
      });
      await utils.account.invalidate();
      props.closeDialog();
    } catch (error) {
      console.log(error);
      let message = "Aconteceu um erro inesperado.";
      if (error instanceof TRPCClientError) {
        message = error.message;
      }
      toast.error("Não conseguimos atualizar seu perfil.", {
        description: message,
      });
    }
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Alterar perfil</DialogTitle>
        <DialogDescription>
          Altere suas informações aqui. Clique em salvar quando terminar.
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
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Seu nome completo"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="email@exemplo.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="******" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter>
            <Button disabled={form.formState.isSubmitting} type="submit">
              {form.formState.isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Salvar alterações"
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
