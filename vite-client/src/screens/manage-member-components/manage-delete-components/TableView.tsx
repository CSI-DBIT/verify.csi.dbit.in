import { DataTableColumnHeader } from "@/components/reusableComponents/DataTableColumnHeader";
import { CardDescription } from "@/components/ui/card";
import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { MemberDetailsSchema } from "@/validationSchemas/MemberDetailSchema";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import { FC } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import DataTable from "../DataTable";
import { branchText, durationText } from "../constants";

interface ManageDeleteTableViewProps {
  delMemberTabledata: MemberDetailsSchema[];
  setIsOperationInProgress: React.Dispatch<React.SetStateAction<boolean>>;
}
const DeleteTableView: FC<ManageDeleteTableViewProps> = ({
  delMemberTabledata,
  setIsOperationInProgress,
}) => {
  const handleRevoke = async (revokingMember: MemberDetailsSchema) => {
    try {
      setIsOperationInProgress(true);
      // Make API call to revoke the member
      await axios.put(
        `http://localhost:5000/api/member/${revokingMember.studentId}/revoke`
      );
      // Show success toast
      toast({
        title: "Member revoked successfully",
        variant: "default",
      });
    } catch (error) {
      // Handle error
      console.error("Error revoking member:", error);
      // Show error toast
      toast({
        title: "Error revoking member",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };
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
        const revokingMember = row.original;

        return (
          <Dialog>
            <DialogTrigger>
              <Button
                variant="outline"
                className="bg-green-600 hover:bg-green-700"
              >
                Revoke
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Revoke Member</DialogTitle>
                <DialogDescription>
                  Are you sure you want to revoke this member?
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[100px] rounded-md border p-3">
                <CardDescription>Name: {revokingMember.name}</CardDescription>
                <CardDescription>
                  Email: {revokingMember?.email}
                </CardDescription>
                <CardDescription>
                  Student id: {revokingMember?.studentId}
                </CardDescription>
                <CardDescription>
                  Branch: {branchText[Number(revokingMember?.branch)]}
                </CardDescription>
                <CardDescription>
                  Duration: {durationText[Number(revokingMember?.duration)]}
                </CardDescription>
                <CardDescription>
                  Start Date: {revokingMember?.startDate.toString()}
                </CardDescription>
              </ScrollArea>
              <DialogFooter>
                <Button
                  variant="outline"
                  className="hover:bg-green-600"
                  onClick={async () => handleRevoke(revokingMember)}
                >
                  Confirm Revoke
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        );
      },
      enableHiding: false,
      enableSorting: true,
    },
  ];
  return (
    <div className="p-4">
      <DataTable columns={columns} data={delMemberTabledata} rowsPerPage={5} />
    </div>
  );
};

export default DeleteTableView;
