import { z } from "zod";
import { toast } from "sonner";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Dialog
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
import { Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { Textarea } from "@app/components/ui/textarea";
import { Button } from "@app/components/ui/button";
import { TRPCClientError } from "@trpc/react-query";
import { trpc } from "@app/lib/trpc";
import { useState } from "react";

const inviteFormSchema = z.object({
  recipientEmail: z.string().email(),
  message: z.string().max(140).optional(),
  role: z.enum(["Organizador", "Participante", "Observador"]),
});

export function InviteForm() {
  const { groupId } = useParams();
  const { mutateAsync: invite } = trpc.groups.invite.useMutation();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof inviteFormSchema>>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      recipientEmail: "",
      message: "",
      role: "Participante",
    },
  });

  async function onSubmit(values: z.infer<typeof inviteFormSchema>) {
    try {
      if (groupId == null)
        throw new Error("Selecione um grupo antes de enviar um convite.");
      await invite({
        groupId: parseInt(groupId),
        ...values,
      });
      toast.success("Enviamos seu convite.", {
        description: `Convite enviado para: ${values.recipientEmail}`,
      });
      setOpen(false)
    } catch (error) {
      let message = "Aconteceu um erro inesperado.";
      if (error instanceof TRPCClientError || error instanceof Error) {
        message = error.message;
      }
      toast.error("Não conseguimos enviar o convite.", {
        description: message,
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Convidar</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo convite</DialogTitle>
          <DialogDescription>
            Forneça o e-mail e convide um novo membro para o seu grupo.
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
                name="recipientEmail"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>E-mail do convidado</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="email@exemplo.com"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Papel</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={"Participante"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o papel no novo membro" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Organizador">Organizador</SelectItem>
                        <SelectItem value="Participante">
                          Participante
                        </SelectItem>
                        <SelectItem value="Observador">Observador</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Envie uma mensagem de boas vindas.</FormLabel>
                  <FormControl>
                    <Textarea className="resize-none" {...field} />
                  </FormControl>
                  <FormDescription>
                    Essa mensagem será exibida no convite mas é opcional.
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
                  "Enviar convite"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
