import Link from "next/link";
import { CreateAccountForm } from "./form";

export default function SignUpPage() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center w-full">
      <span className="font-medium text-sm text-muted-foreground">
        Crie sua conta para começar a organizar
      </span>
      <CreateAccountForm />
      <Link href="/login" className="text-sm text-blue-600 hover:underline">
        Já tem uma conta? Faça login
      </Link>
    </div>
  );
}
