import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@app/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@app/components/ui/form";
import { Input } from "@app/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { trpc } from "@app/lib/trpc";
import { TRPCClientError } from "@trpc/client";

const signUpFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "O nome precisa ter pelo menos 2 caracteres." })
    .max(140, { message: "O nome pode ter no máximo 140 caracteres." }),
  email: z.string().email({ message: "Insira um endereço de e-mail válido." }),
  password: z
    .string()
    .min(6, { message: "A senha precisa ter pelo menos 6 caracteres." })
    .max(20, { message: "A senha pode ter no máximo 20 caracteres." }),
});

export function SignUpPage() {
  const { mutateAsync: createAccount } = trpc.account.create.useMutation();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: "",
      password: "",
      name: ""
    },
  });

  async function onSubmit(values: z.infer<typeof signUpFormSchema>) {
    try {
      await createAccount(values);
      toast.success("Conta criada com sucesso!", {
        action: {
          label: "Login",
          onClick: () => navigate(`/sign-in?email=${values.email}`),
        },
      });
    } catch (error) {
      let message = "Aconteceu um erro inesperado.";
      if (error instanceof TRPCClientError) {
        message = error.message;
      }
      toast.error("Não conseguimos criar sua conta.", {
        description: message,
      });
    }
  }

  return (
    <>
      <div className="flex flex-col gap-2 text-center">
        <p className="text-sm text-muted-foreground">
          Crie sua conta para começar a organizar
        </p>
      </div>
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
          <Button disabled={form.formState.isSubmitting} type="submit">
            {form.formState.isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Cadastrar-se"
            )}
          </Button>
        </form>
      </Form>
      <Link
        to="/sign-in"
        className="text-sm text-center text-blue-600 hover:underline"
      >
        Já tem uma conta? Faça login
      </Link>
    </>
  );
}
