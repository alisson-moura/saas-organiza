import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
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
import { trpc } from "@app/lib/trpc";
import { TRPCClientError } from "@trpc/client";

const authFormSchema = z.object({
  email: z.string().email({ message: "Insira um endereço de e-mail válido." }),
  password: z
    .string()
    .min(6, { message: "A senha precisa ter pelo menos 6 caracteres." })
    .max(20, { message: "A senha pode ter no máximo 20 caracteres." }),
});

export function SignInPage() {
  const { mutateAsync: authenticate } = trpc.account.auth.useMutation();
  const [searchParams] = useSearchParams()

  const form = useForm<z.infer<typeof authFormSchema>>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      email: searchParams.get('email') ?? "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof authFormSchema>) {
    try {
      const { token } = await authenticate(values);
      console.log(token);
    } catch (error) {
      let message = "Aconteceu um erro inesperado.";
      if (error instanceof TRPCClientError) {
        message = error.message;
      }
      toast.error("Erro ao acessar o app.", {
        description: message,
      });
    }
  }

  return (
    <>
      <div className="flex flex-col gap-2 text-center">
        <p className="text-sm text-muted-foreground">
          Organize juntos, simplifique tudo
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
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
              "Acessar"
            )}
          </Button>
        </form>
      </Form>
      <div className="flex justify-between w-full">
        <Link to="/sign-up" className="text-sm text-blue-600 hover:underline">
          Cadastre-se
        </Link>
        <Link
          to="/auth/recovery"
          className="text-sm text-blue-600 hover:underline"
        >
          Esqueci minha senha
        </Link>
      </div>
    </>
  );
}
