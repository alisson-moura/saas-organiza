import { ColumnDef } from "@tanstack/react-table";
import {
  MoreHorizontal,
  ArrowUpDown,
  Circle,
  Timer,
  CheckCircle,
  ArrowDown,
  ArrowRight,
  ArrowUp,
} from "lucide-react";
import { Button } from "@app/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@app/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@app/components/ui/select";
import { trpc } from "@app/lib/trpc";
import { AbilityContext } from "@app/lib/casl";
import { useContext } from "react";

export type Item = {
  id: number;
  title: string;
  assigned?: {
    id: number;
    name: string;
  } | null;
  description?: string | null;
  priority: "high" | "low" | "medium";
  status: "pending" | "processing" | "done";
  listId: number;
};

const priorityLabels = [
  {
    label: "Baixa",
    value: "low",
    icon: ArrowDown,
  },
  {
    label: "Média",
    value: "medium",
    icon: ArrowRight,
  },
  {
    label: "Alta",
    value: "high",
    icon: ArrowUp,
  },
];

const statusLabels = [
  {
    value: "pending",
    label: "Pendente",
    icon: Circle,
  },
  {
    value: "processing",
    label: "Em andamento",
    icon: Timer,
  },
  {
    value: "done",
    label: "Feito",
    icon: CheckCircle,
  },
];

export const Columns = (): ColumnDef<Item>[] => {
  const ability = useContext(AbilityContext);
  return [
    { accessorKey: "title", header: "Item" },
    {
      accessorKey: "status",
      header: () => {
        return <div className="text-left">Status</div>;
      },
      cell: ({ row }) => {
        const trpcUtils = trpc.useUtils();
        const { mutate } = trpc.lists.changeItemStatus.useMutation();
        const original = row.original;

        const handleChangeStatus = async (
          status: "pending" | "processing" | "done"
        ) => {
          mutate(
            { itemId: original.id, status },
            {
              onSuccess: async () => {
                await trpcUtils.lists.getItems.invalidate();
              },
            }
          );
        };
        const status = statusLabels.find(
          (status) => status.value === row.getValue("status")
        );
        if (!status) {
          return null;
        }
        return (
          <Select
            defaultValue={original.status}
            onValueChange={handleChangeStatus}
            disabled={ability.cannot("update", "Item")}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione o status do item" />
            </SelectTrigger>
            <SelectContent>
              {statusLabels.map((label) => (
                <SelectItem key={label.value} value={label.value}>
                  <div className="flex items-center">
                    <label.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{label.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      },
    },
    {
      accessorKey: "assigned",
      header: "Responsável",
      cell: ({ row }) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let value = row.getValue("assigned") as any;
        if (value != null) {
          value = value.name;
        } else {
          value = "Ninguém";
        }
        return <div className="text-left">{value}</div>;
      },
    },
    {
      accessorKey: "priority",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Prioridade
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const priority = priorityLabels.find(
          (priority) => priority.value === row.getValue("priority")
        );
        if (!priority) {
          return null;
        }
        return (
          <div className="flex w-full justify-center items-center">
            {priority.icon && (
              <priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />
            )}
            <span>{priority.label}</span>
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuItem>Detalhes</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => console.log(item)}>
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem>Remover</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};
