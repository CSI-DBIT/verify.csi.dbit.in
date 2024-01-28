import { DataTableColumnHeader } from "@/components/reusableComponents/DataTableColumnHeader";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MemberDetailsSchema } from "@/validationSchemas/MemberDetailSchema";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

export const columns: ColumnDef<MemberDetailsSchema>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Name"} />
      ),
      enableHiding: false,
      enableSorting: true,
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Email"} />
      ),
      enableHiding: true,
      enableSorting: true,
    },
    {
      accessorKey: "studentId",
      header: "Student Id",
      enableHiding: true,
      enableSorting: true,
    },
    {
      accessorKey: "branch",
      header: () => <div>Branch</div>,
      cell: ({ row }) => {
        const branchNumber = parseInt(row.getValue("branch"), 10);

        // Map numeric values to corresponding text
        const branchText = {
          1: "Information Technology",
          2: "Computer Science",
          3: "Electronics & Telecommunication",
          4: "Mechanical Engineering",
        }[branchNumber];

        return <div>{branchText}</div>;
      },
      enableHiding: true,
      enableSorting: true,
    },
    {
      accessorKey: "duration",
      header: () => <div>Duration</div>,
      cell: ({ row }) => {
        const durationNumber = parseInt(row.getValue("duration"), 10);

        // Map numeric values to corresponding text
        const durationText = {
          1: "One Year",
          2: "Two Years",
          3: "Three Years",
        }[durationNumber];

        return <div>{durationText}</div>;
      },
      enableHiding: true,
      enableSorting: true,
    },
    {
      accessorKey: "startDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Start Date"} />
      ),
      cell: ({ row }) => {
        const startDateString = row.getValue("startDate") as string;
        // Parse the ISO date string into a Date object
        const startDate = new Date(startDateString);
        // Format the date in a desired format
        const formattedStartDate = startDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });

        return <div>{formattedStartDate}</div>;
      },
      enableHiding: true,
      enableSorting: true,
    },
    {
      id: "actions",
      header: () => <div>Actions</div>,
      cell: ({ row }) => {
        const member = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(member.studentId)}
              >
                Copy payment ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View customer</DropdownMenuItem>
              <DropdownMenuItem>View payment details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      enableHiding: false,
      enableSorting: true,
    },
  ];