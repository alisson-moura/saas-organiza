import { useState } from "react";
import { Check, ChevronsUpDown, CirclePlus, User, Users } from 'lucide-react';
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

const groups: any[] = [
  { id: 1, name: "Aleatórios", role: "Líder" },
  { id: 2, name: "Aleatórios adsadsadss adsdsa", role: "Organizador" },
  { id: 3, name: "Aleatórios", role: "Participante" },
  { id: 4, name: "Aleatórios", role: "Observador" }
];

export function Menu() {
  const [selectedAccount, setSelectedAccount] = useState({ id: "personal", role: "Pessoal" });
  const [groupDialogIsOpen, setGroupDialogIsOpen] = useState(false);

  return (
    <Dialog open={groupDialogIsOpen} onOpenChange={setGroupDialogIsOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="ghost"
            className="w-[250px] justify-between"
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="truncate">
                {selectedAccount.id === "personal"
                  ? "Alisson Moura"
                  : groups.find((g) => g.id.toString() === selectedAccount.id)?.name}
              </span>
              <span className="bg-secondary text-secondary-foreground text-xs font-medium px-2 py-0.5 rounded-full">
                {selectedAccount.role}
              </span>
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[250px]">
          <DropdownMenuLabel className="text-muted-foreground">
            Conta Pessoal
          </DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => setSelectedAccount({ id: "personal", role: "Pessoal" })}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2 overflow-hidden">
                <User className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">Alisson Matheus de Oliveira Moura</span>
              </div>
              {selectedAccount.id === "personal" && <Check className="h-4 w-4 flex-shrink-0" />}
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="my-2" />
          <DropdownMenuLabel className="text-muted-foreground">
            Grupos
          </DropdownMenuLabel>
          <DropdownMenuGroup>
            {groups.map((group) => (
              <DropdownMenuItem
                key={group.id}
                onClick={() => setSelectedAccount({ id: group.id.toString(), role: group.role })}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Users className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{group.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-secondary text-secondary-foreground text-xs font-medium px-2 py-0.5 rounded-full">
                      {group.role}
                    </span>
                    {selectedAccount.id === group.id.toString() && (
                      <Check className="h-4 w-4 flex-shrink-0" />
                    )}
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DialogTrigger asChild>
            <DropdownMenuItem>
              <div className="flex items-center gap-2">
                <CirclePlus className="h-4 w-4 flex-shrink-0" />
                <span className="font-semibold">Criar grupo</span>
              </div>
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogGroup closeDialog={() => setGroupDialogIsOpen(false)} />
    </Dialog>
  );
}