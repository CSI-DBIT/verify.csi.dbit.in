// import { DataTableFacetedFilter } from "@/components/reusableComponents/DataTableFacetedFilter";
import { DataTablePagination } from "@/components/reusableComponents/DataTablePagination";
// import { DataTableViewOptions } from "@/components/reusableComponents/DataTableViewOptions";
// import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getFacetedUniqueValues,
  getFacetedRowModel,
  flexRender,
} from "@tanstack/react-table";
// import {
//   branch,
//   duration,
//   gender,
//   currentAcademicYear,
//   currentSemester,
// } from "./manageMemberConstants";
import { useState } from "react";
// import { X } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  rowsPerPage: number;
}
function DataTable<TData, TValue>({
  columns,
  data,
  rowsPerPage,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const table = useReactTable({
    data,
    columns,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: rowsPerPage,
      },
    },
  });
//   const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          <Input
            placeholder="Filter by name..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          {/* {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => table.resetColumnFilters()}
              className="flex gap-2 px-2 lg:px-3"
            >
              Reset
              <X className="h-4 w-4" />
            </Button>
          )} */}
        </div>
        {/* <div className="flex gap-2 flex-wrap items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {table.getColumn("duration") && (
              <DataTableFacetedFilter
                column={table.getColumn("duration")}
                title="Duration"
                options={duration}
              />
            )}
            {table.getColumn("branch") && (
              <DataTableFacetedFilter
                column={table.getColumn("branch")}
                title="Branch"
                options={branch}
              />
            )}
            {table.getColumn("gender") && (
              <DataTableFacetedFilter
                column={table.getColumn("gender")}
                title="Gender"
                options={gender}
              />
            )}
            {table.getColumn("currentAcademicYear") && (
              <DataTableFacetedFilter
                column={table.getColumn("currentAcademicYear")}
                title="Academic Year"
                options={currentAcademicYear}
              />
            )}
            {table.getColumn("currentSemester") && (
              <DataTableFacetedFilter
                column={table.getColumn("currentSemester")}
                title="Semester"
                options={currentSemester}
              />
            )}
          </div>
          <DataTableViewOptions table={table} />
        </div> */}
      </div>
      <div className="rounded-md border">
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
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}

export default DataTable;
