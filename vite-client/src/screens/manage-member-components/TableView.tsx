import { toast } from "@/components/ui/use-toast";
import { MemberDetailsSchema } from "@/validationSchemas/MemberDetailSchema";
import { FC, useState } from "react";
import DataTable from "@/screens/manage-member-components/DataTable";
import { DataTableColumnHeader } from "@/components/reusableComponents/DataTableColumnHeader";
import { CardDescription } from "@/components/ui/card";
import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditMemberForm from "./EditMemberForm";
import { branchText, durationText } from "./constants";

interface ManageMemberTableViewProps {
  memberTabledata: MemberDetailsSchema[];
  setIsOperationInProgress: React.Dispatch<React.SetStateAction<boolean>>;
}

const ManageMemberTableView: FC<ManageMemberTableViewProps> = ({
  memberTabledata,
  setIsOperationInProgress,
}) => {
  const [editingMember, setEditingMember] =
    useState<MemberDetailsSchema | null>(null);
  const [deletingMember, setDeletingMember] =
    useState<MemberDetailsSchema | null>(null);
  const columns: ColumnDef<MemberDetailsSchema>[] = [
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
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Branch"} />
      ),
      cell: ({ row }) => {
        const branchNumber = parseInt(row.getValue("branch"), 10);
        return <div>{branchText[branchNumber]}</div>;
      },
      enableHiding: true,
      enableSorting: true,
    },
    {
      accessorKey: "duration",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Duration"} />
      ),
      cell: ({ row }) => {
        const durationNumber = parseInt(row.getValue("duration"), 10);
        return <div>{durationText[durationNumber]}</div>;
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
            <DropdownMenuContent>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <Dialog>
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      console.log("Editing member:", member);
                      setEditingMember(member);
                    }}
                  >
                    edit
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Member Details</DialogTitle>
                    <DialogDescription>
                      Edit member details and submit the form
                    </DialogDescription>
                  </DialogHeader>
                  <EditMemberForm
                    editingMember={editingMember}
                    setIsOperationInProgress={setIsOperationInProgress}
                  />
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      console.log("Deleting member:", member);
                      setDeletingMember(member);
                    }}
                  >
                    delete
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Member</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this member?
                    </DialogDescription>
                  </DialogHeader>
                  <div className="p-2">
                    <ScrollArea className="h-[100px] rounded-md border p-4">
                      <CardDescription>
                        Name: {deletingMember?.name}
                      </CardDescription>
                      <CardDescription>
                        Email: {deletingMember?.email}
                      </CardDescription>
                      <CardDescription>
                        Student id: {deletingMember?.studentId}
                      </CardDescription>
                      <CardDescription>
                        Branch: {branchText[Number(deletingMember?.branch)]}
                      </CardDescription>
                      <CardDescription>
                        Duration:{" "}
                        {durationText[Number(deletingMember?.duration)]}
                      </CardDescription>
                      <CardDescription>
                        Start Date: {deletingMember?.startDate.toString()}
                      </CardDescription>
                    </ScrollArea>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setDeletingMember(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="outline"
                      className="hover:bg-red-600"
                      onClick={async () => {
                        try {
                          setIsOperationInProgress(true);
                          // Make API call to delete the member
                          await axios.put(
                            `http://localhost:5000/api/delete/member/${deletingMember?._id}`
                          );

                          // After successful deletion, reset the deletingMember state
                          setDeletingMember(null);
                          // Show success toast
                          toast({
                            title: "Member deleted successfully",
                            variant: "default",
                          });
                        } catch (error) {
                          // Handle error
                          console.error("Error deleting member:", error);
                          // Show error toast
                          toast({
                            title: "Error deleting member",
                            description:
                              error.message || "An unexpected error occurred",
                            variant: "destructive",
                          });
                        }
                      }}
                    >
                      Confirm Delete
                    </Button>
                  </DialogFooter>
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
  return <DataTable columns={columns} data={memberTabledata} />;
};

export default ManageMemberTableView;
