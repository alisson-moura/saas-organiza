import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { LogOut, UserRound } from "lucide-react";

export function AccountMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex select-none items-center gap-2"
        >
          Alisson Moura
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="p-2">
        <DropdownMenuLabel className="flex flex-col">
          <span className="text-sm font-semibold">Alisson Matheus de Oliveira Moura</span>
          <span className="text-xs font-normal text-muted-foreground">
            alisson.mo.moura@outlook.com.br
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-2"/>
        <DropdownMenuItem>
            <span>Perfil</span>
            <UserRound className="ml-auto w-4 h-4"/>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-rose-500 dark:text-rose-400">
            <span>Sair</span>
            <LogOut className="ml-auto w-4 h-4"/>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
