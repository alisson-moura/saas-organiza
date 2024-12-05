import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@app/components/ui/table";
import { Button } from "@app/components/ui/button";
import { Input } from "@app/components/ui/input";
import { useMemo, useState } from "react";
import { trpc } from "@app/lib/trpc";
import { columns } from "./columns";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@app/components/ui/select";

interface TableProps {
  listId: number;
}

export function ItemsTable({ listId }: TableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0, // Página inicial
    pageSize: 10, // Tamanho da página
  });

  const data = trpc.lists.getItems.useQuery(
    {
      limit: pagination.pageSize,
      page: pagination.pageIndex,
      item: {
        listId,
      },
    },
    { keepPreviousData: true }
  );
  const defaultData = useMemo(() => [], []);

  const table = useReactTable({
    data: data.data?.items ?? defaultData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    rowCount: data.data?.total,
    state: {
      pagination,
      sorting,
      columnFilters,
    },
  });

  return (
    <div>
      <div className="flex items-center pb-4">
        <Input
          placeholder="Procure por itens..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Sem resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between py-4">
        <span>
          Página {pagination.pageIndex + 1} de {table.getPageCount()}
        </span>
        <div className="space-x-2 flex">
          <Select
            onValueChange={(e) => {
              table.setPageSize(Number(e))
            }}
            defaultValue={`${pagination.pageSize}`}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Selecione a quantidade de itens por página" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Itens por página</SelectLabel>
                <SelectItem value="10">10 itens</SelectItem>
                <SelectItem value="20">20 itens</SelectItem>
                <SelectItem value="30">30 itens</SelectItem>
                <SelectItem value="40">40 itens</SelectItem>
                <SelectItem value="50">50 itens</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Próxima
          </Button>
        </div>
      </div>
    </div>
  );
}
