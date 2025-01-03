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
import DataTable from "./DataTable";
import {
  branchText,
  currentAcademicYearText,
  currentSemesterText,
  durationText,
  genderText,
} from "../constants";
import { UserRoundCheck, UserRoundMinus } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ManageDeleteTableViewProps {
  delMemberTabledata: MemberDetailsSchema[];
  setIsOperationInProgress: React.Dispatch<React.SetStateAction<boolean>>;
}
const ManageDeleteTableView: FC<ManageDeleteTableViewProps> = ({
  delMemberTabledata,
  setIsOperationInProgress,
}) => {
  const handleRevoke = async (revokingMember: MemberDetailsSchema) => {
    try {
      setIsOperationInProgress(true);

      // Make the API call to revoke the member with the modified data
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/member/revoke?studentId=${
          revokingMember.studentId
        }`,
        {
          currentDate: new Date(), // Set lastRevoked to the current date
          email: revokingMember.email,
          mobileNumber: revokingMember.mobileNumber,
        }
      );
      if (response.data.success) {
        toast({
          title: response.data.message,
          variant: "default",
        });
      } else {
        toast({
          title: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      // Handle error
      console.error("Error revoking member:", error);
      // Show error toast
      toast({
        title: "Error revoking member",
        description: "An unexpected error occurred",
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
      accessorKey: "mobileNumber",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Mobile No"} />
      ),
      enableHiding: true,
      enableSorting: true,
    },
    {
      accessorKey: "gender",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Gender"} />
      ),
      cell: ({ row }) => {
        const genderNumber = parseInt(row.getValue("gender"), 10);
        return <div>{genderText[genderNumber]}</div>;
      },
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
      accessorKey: "currentAcademicYear",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Academic Year"} />
      ),
      cell: ({ row }) => {
        const academicYearNumber = parseInt(
          row.getValue("currentAcademicYear"),
          10
        );
        return <div>{currentAcademicYearText[academicYearNumber]}</div>;
      },
      enableHiding: true,
      enableSorting: true,
    },
    {
      accessorKey: "currentSemester",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Semester"} />
      ),
      cell: ({ row }) => {
        const SemesterNumber = parseInt(row.getValue("currentSemester"), 10);
        return <div>{currentSemesterText[SemesterNumber]}</div>;
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
      id: "isMember",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Is Member"} />
      ),
      cell: ({ row }) => {
        const startDate = new Date(row.getValue("startDate"));
        const duration = Number(row.getValue("duration"));

        console.log(startDate, duration);
        const endDate = new Date(
          startDate.getTime() + duration * 365 * 24 * 60 * 60 * 1000
        );
        const isMember = new Date() < endDate;
        if (isMember) {
          return (
            <div className="flex flex-wrap gap-2">
              <UserRoundCheck color="#07e704" />
              <span>Member</span>
            </div>
          );
        } else {
          return (
            <div className="flex flex-wrap gap-2">
              <UserRoundMinus color="#e70404" />
              <span>Non Member</span>
            </div>
          );
        }
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
              <ScrollArea className="h-[250px] rounded-md border p-3">
                <CardDescription>Name: {revokingMember.name}</CardDescription>
                <CardDescription>Email: {revokingMember.email}</CardDescription>
                <CardDescription>
                  Mobile Number: {revokingMember.mobileNumber}
                </CardDescription>
                <CardDescription>
                  Gender: {genderText[Number(revokingMember.gender)]}
                </CardDescription>
                <CardDescription>
                  Student id: {revokingMember.studentId}
                </CardDescription>
                <CardDescription>
                  Branch: {branchText[Number(revokingMember.branch)]}
                </CardDescription>
                <CardDescription>
                  Current Academic Year:{" "}
                  {
                    currentAcademicYearText[
                      Number(revokingMember.currentAcademicYear)
                    ]
                  }
                </CardDescription>
                <CardDescription>
                  Current Semester:{" "}
                  {currentSemesterText[Number(revokingMember.currentSemester)]}
                </CardDescription>
                <CardDescription>
                  Duration: {durationText[Number(revokingMember.duration)]}
                </CardDescription>
                <CardDescription>
                  Start Date: {formatDate(revokingMember.startDate.toString())}
                </CardDescription>
              </ScrollArea>
              <DialogFooter>
                <Button
                  variant="outline"
                  className="bg-green-600 hover:bg-green-800 w-full"
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

export default ManageDeleteTableView;
