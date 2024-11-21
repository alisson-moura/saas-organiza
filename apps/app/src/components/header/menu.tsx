import { useState } from "react";
import { Check, ChevronsUpDown, CirclePlus, User, Users } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { DialogGroup } from "./group";

const groups: any[] = [];

export function Menu() {
  const [selectedAccount, setSelectedAccount] = useState("personal");

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="ghost"
            className="w-[250px] justify-between"
          >
            {selectedAccount === "personal"
              ? "Alisson Moura"
              : groups.find((g) => g.id.toString() === selectedAccount)?.name}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[250px]">
          <DropdownMenuLabel className="text-muted-foreground">
            Conta Pessoal
          </DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => setSelectedAccount("personal")}
            className="justify-between"
          >
            <div className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              <span>Alisson Matheus de Oliveira Moura</span>
            </div>
            {selectedAccount === "personal" && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
          <DropdownMenuSeparator className="my-2" />
          <DropdownMenuLabel className="text-muted-foreground">
            Grupos
          </DropdownMenuLabel>
          <DropdownMenuGroup>
            {groups.map((group) => (
              <DropdownMenuItem
                key={group.id}
                onClick={() => setSelectedAccount(group.id.toString())}
                className="justify-between"
              >
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  <span>{group.name}</span>
                </div>
                {selectedAccount === group.id.toString() && (
                  <Check className="h-4 w-4" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DialogTrigger asChild>
            <DropdownMenuItem>
              <CirclePlus className="mr-2 h-4 w-4" />
              <span className="font-semibold">Criar grupo</span>
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogGroup />
    </Dialog>
  );
}
