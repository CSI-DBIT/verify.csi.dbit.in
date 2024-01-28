import { DataTableColumnHeader } from "@/components/reusableComponents/DataTableColumnHeader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MemberDetailsSchema } from "@/validationSchemas/MemberDetailSchema";
import { ColumnDef } from "@tanstack/react-table";
import {
  FileStack,
  MoreHorizontal,
  Pencil,
  Users,
  XCircle,
} from "lucide-react";

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
      // const member = row.original;
      const member: MemberDetailsSchema = row.original;
      function handleEdit(studentId: string) {
        console.log(studentId);
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel className="text-muted-foreground">
              actions
            </DropdownMenuLabel>
            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    handleEdit(member.studentId);
                  }}
                >
                  Edit
                  <DropdownMenuShortcut>
                    <Pencil className="h-4 w-4 text-muted-foreground/70" />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Member Data</DialogTitle>
                  <DialogDescription>
                    Here you can add fields to update your form
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Delete
                  <DropdownMenuShortcut>
                    <XCircle className="h-4 w-4 text-muted-foreground/70" />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Member</DialogTitle>
                  <DialogDescription>
                    Here you can add fields to update your form
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-muted-foreground">
              view
            </DropdownMenuLabel>
            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Profile
                  <DropdownMenuShortcut>
                    <Users className="h-4 w-4 text-muted-foreground/70" />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Certificates
                  <DropdownMenuShortcut>
                    <FileStack className="h-4 w-4 text-muted-foreground/70" />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableHiding: false,
    enableSorting: true,
  },
];
