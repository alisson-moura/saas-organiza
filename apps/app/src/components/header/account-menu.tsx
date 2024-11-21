import { useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, UserRound } from "lucide-react";
import { trpc } from "@app/lib/trpc";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Skeleton } from "../ui/skeleton";
import { DialogProfile } from "./profile";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { useState } from "react";

export function AccountMenu() {
  const [profileDialogIsOpen, setProfileDialogIsOpen] = useState(false)

  const navigate = useNavigate();
  const { mutate: logout } = trpc.auth.logout.useMutation({
    onSuccess: () => {
      navigate("/sign-in");
    },
  });
  const { data, isLoading } = trpc.account.me.useQuery();

  function getFirstAndLastName(fullName: string) {
    const names = fullName.trim().split(" ");
    if (names.length === 1) {
      return names[0]; // Caso o nome tenha apenas uma palavra
    }
    const firstName = names[0];
    const lastName = names[names.length - 1];
    return `${firstName} ${lastName}`;
  }

  return (
    <Dialog open={profileDialogIsOpen} onOpenChange={setProfileDialogIsOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex select-none items-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <Skeleton className="w-[100px] h-[20px] rounded-full" />
            ) : (
              data?.account && getFirstAndLastName(data.account.name)
            )}
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="p-2">
          <DropdownMenuLabel className="flex flex-col">
            <span className="text-sm font-semibold">{data?.account.name}</span>
            <span className="text-xs font-normal text-muted-foreground">
              {data?.account.email}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="my-2" />
          <DialogTrigger asChild>
            <DropdownMenuItem>
              <span>Perfil</span>
              <UserRound className="ml-auto w-4 h-4" />
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuItem
            onClick={() => logout()}
            className="text-rose-500 dark:text-rose-400"
          >
            <span>Sair</span>
            <LogOut className="ml-auto w-4 h-4" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {data?.account && (
        <DialogProfile
          closeDialog={() => setProfileDialogIsOpen(false)}
        />
      )}
    </Dialog>
  );
}
