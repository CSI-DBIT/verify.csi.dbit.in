import { MemberDetailsSchema } from "@/validationSchemas/MemberDetailSchema";
import { FC } from "react";
import DataTable from "@/screens/manage-member-components/DataTable";
import { DataTableColumnHeader } from "@/components/reusableComponents/DataTableColumnHeader";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, UserRoundCheck, UserRoundMinus } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditMemberForm from "./EditMemberForm";
import {
  branchText,
  currentAcademicYearText,
  currentSemesterText,
  durationText,
  genderText,
} from "../constants";
import DeleteMemberForm from "./DeleteMemberForm";

interface ManageMemberTableViewProps {
  memberTabledata: MemberDetailsSchema[];
  setIsOperationInProgress: React.Dispatch<React.SetStateAction<boolean>>;
}

const ManageMemberTableView: FC<ManageMemberTableViewProps> = ({
  memberTabledata,
  setIsOperationInProgress,
}) => {
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
      id: "Membership",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Membership"} />
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
              <span>Active</span>
            </div>
          );
        } else {
          return (
            <div className="flex flex-wrap gap-2">
              <UserRoundMinus color="#e70404" />
              <span>Inactive</span>
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
              <EditMemberForm
                editingMember={member}
                setIsOperationInProgress={setIsOperationInProgress}
              />
              <DeleteMemberForm
                deletingMember={member}
                setIsOperationInProgress={setIsOperationInProgress}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      enableHiding: false,
      enableSorting: true,
    },
  ];
  return (
      <DataTable columns={columns} data={memberTabledata} rowsPerPage={10} />
  );
};

export default ManageMemberTableView;
