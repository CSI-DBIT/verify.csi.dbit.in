import { DataTableColumnHeader } from "@/components/reusableComponents/DataTableColumnHeader";
import { Button } from "@/components/ui/button";
import {
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
  Drawer,
} from "@/components/ui/drawer";
import { branchText, durationText } from "./constants";
import DataTable from "./DataTable";
import { MemberDetailsSchema } from "@/validationSchemas/MemberDetailSchema";
import { ColumnDef } from "@tanstack/react-table";
import { FC } from "react";
import { toast } from "@/components/ui/use-toast";
import axios from "axios";
interface ManageDeleteProps {
  delMemberTabledata: MemberDetailsSchema[];
}
const ManageDelete: FC<ManageDeleteProps> = ({ delMemberTabledata }) => {
  return (
    <Drawer>
      <DrawerTrigger className="pr-2 pb-2">
        <Button>View Deleted Members</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>This action cannot be undone.</DrawerDescription>
        </DrawerHeader>
        <DeleteTableView delMemberTabledata={delMemberTabledata} />
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="default">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

interface ManageDeleteTableViewProps {
  delMemberTabledata: MemberDetailsSchema[];
}
const DeleteTableView: FC<ManageDeleteTableViewProps> = ({
  delMemberTabledata,
}) => {
  const handleRevoke = async (revokingMember: MemberDetailsSchema) => {
    try {
      // Make API call to revoke the member
      await axios.put(
        `http://localhost:5000/api/member/${revokingMember?._id}/revoke`
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
        const member = row.original;

        return (
          <Button
            variant="outline"
            className="bg-green-600 hover:bg-green-700"
            onClick={() => handleRevoke(member)}
          >
            Revoke
          </Button>
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

export default ManageDelete;
