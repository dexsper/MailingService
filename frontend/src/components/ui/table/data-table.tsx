'use client';

import { JSX, useState } from 'react';

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/shared/table';

import { Input } from '@/components/ui/shared/input';
import { Skeleton } from '@/components/ui/shared/skeleton';

export interface DataTableFilter<TData> {
  accessorKey: keyof TData;
  placeholder: string;
}

interface DataTableProps<TData, TValue> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  filters?: DataTableFilter<TData>[];
  actions?: JSX.Element;
  isLoading?: boolean;
  defaultSorting?: SortingState;
}

export function DataTable<TData, TValue>({
  data,
  columns,
  filters,
  actions,
  isLoading,
  defaultSorting = [],
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>(defaultSorting);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div>
      <div className="flex gap-2 justify-between items-center py-2">
        <div className="flex items-center gap-2">
          {filters?.map((f) => (
            <Input
              key={`filter_${f.accessorKey.toString()}`}
              placeholder={f.placeholder}
              value={
                (table
                  .getColumn(f.accessorKey.toString())
                  ?.getFilterValue() as string) ?? ''
              }
              onChange={(event) =>
                table
                  .getColumn(f.accessorKey.toString())
                  ?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
          ))}
        </div>
        <div className="flex items-center">{actions}</div>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={`row_skeleton_${i}`}>
                {columns.map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-6" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
