"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@web/components/ui/button";
import {
  FormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@web/components/ui/form";
import { Input } from "@web/components/ui/input";
import { useToast } from "@web/hooks/use-toast";
import { trpc } from "@web/trpc";
import { TRPCClientError } from "@trpc/client";
import { useRouter } from 'next/navigation'

const formSchema = z.object({
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

export function CreateAccountForm() {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await trpc.account.create.mutate(values);
      toast({
        title: "Conta criada com sucesso!",
        description: "Bem-vindo(a)! Agora você pode fazer login.",
        action: (
          <Button
            onClick={() => router.push("auth/sign-in")}
            size='sm'
          >
            Ir para o login
          </Button>
        ),
      });
    } catch (error) {
      if (error instanceof TRPCClientError) {
        toast({
          title: "Falha ao criar conta",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Seu nome completo" {...field} />
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
                <Input placeholder="email@exemplo.com" {...field} />
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
        <Button className="w-full" type="submit">
          Cadastrar-se
        </Button>
      </form>
    </Form>
  );
}
