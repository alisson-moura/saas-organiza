import { z } from "zod";
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

export function DialogProfile(props: {
  user: { id: number; name: string; email: string };
}) {
  const form = useForm<z.infer<typeof updateProfileFormSchema>>({
    resolver: zodResolver(updateProfileFormSchema),
    defaultValues: {
      email: props.user.email,
      password: "",
      name: props.user.name,
    },
  });

  async function onSubmit(values: z.infer<typeof updateProfileFormSchema>) {
    // TODO: CALL TRPC API
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
