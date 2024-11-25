import { useEffect, useState } from "react";
import { Check, ChevronsUpDown, CirclePlus, User, Users } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
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
import { trpc } from "@app/lib/trpc";
import { Skeleton } from "../ui/skeleton";

type Group = {
  id: number;
  name: string;
  role: string;
};

export function Menu() {
  const navigate = useNavigate();

  const { groupId } = useParams();
  const { data: personal, isLoading: isLoadingPersonal } =
    trpc.account.me.useQuery();
  const { data: groupsData, isLoading: isLoadingGroups } =
    trpc.groups.list.useQuery();

  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [groupDialogIsOpen, setGroupDialogIsOpen] = useState(false);

  const isLoading = isLoadingPersonal || isLoadingGroups;

  useEffect(() => {
    if (!isLoading && groupId) {
      const currentGroup = groupsData?.groups.find(
        (g) => g.group.id === parseInt(groupId)
      );
      if (currentGroup != null) {
        setSelectedGroup({
          id: currentGroup.group.id,
          name: currentGroup.group.name,
          role: currentGroup.role,
        });
      } else {
        navigate('/')
      }
    }
  }, [isLoading]);

  const handleSelectGroup = (group: Group | null) => {
    setSelectedGroup(group);
    if (group) {
      navigate(`/group/${group.id}`);
    }
  };

  const renderGroupItem = (group: Group) => (
    <DropdownMenuItem key={group.id} onSelect={() => handleSelectGroup(group)}>
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2 overflow-hidden">
          <Users className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{group.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-secondary text-secondary-foreground text-xs font-medium px-2 py-0.5 rounded-full">
            {group.role}
          </span>
          {selectedGroup?.id === group.id && (
            <Check className="h-4 w-4 flex-shrink-0" />
          )}
        </div>
      </div>
    </DropdownMenuItem>
  );

  return (
    <Dialog open={groupDialogIsOpen} onOpenChange={setGroupDialogIsOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="ghost"
            className="w-[250px] justify-between"
          >
            {isLoading ? (
              <Skeleton className="w-full h-6" />
            ) : (
              <>
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="truncate">
                    {selectedGroup
                      ? selectedGroup.name
                      : personal?.account.name}
                  </span>
                  <span className="bg-secondary text-secondary-foreground text-xs font-medium px-2 py-0.5 rounded-full">
                    {selectedGroup?.role ?? "Pessoal"}
                  </span>
                </div>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[250px]">
          <DropdownMenuLabel className="text-muted-foreground">
            Conta Pessoal
          </DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => {
              setSelectedGroup(null);
              navigate("/");
            }}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2 overflow-hidden">
                <User className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{personal?.account.name}</span>
              </div>
              {selectedGroup === null && (
                <Check className="h-4 w-4 flex-shrink-0" />
              )}
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="my-2" />
          <DropdownMenuLabel className="text-muted-foreground">
            Grupos
          </DropdownMenuLabel>
          <DropdownMenuGroup>
            {groupsData?.groups.map((item) =>
              renderGroupItem({
                id: item.group.id,
                name: item.group.name,
                role: item.role,
              })
            )}
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
