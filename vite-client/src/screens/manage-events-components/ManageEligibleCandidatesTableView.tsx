import { FC } from "react";
import { DataTableColumnHeader } from "@/components/reusableComponents/DataTableColumnHeader";
import { DialogHeader } from "@/components/ui/dialog";
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
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
// import EditMemberForm from "./EditMemberForm";
import { branchText, currentAcademicYearText } from "../constants";
// import DeleteMemberForm from "./DeleteMemberForm";
import { EligibleCandidatesSchema } from "@/validationSchemas/EligibleCadidatesSchema";
import EligibleCandidatesDataTable from "./EligibleCandidatesDataTable";
import { stringify } from "querystring";
import EditEligibleCandidateForm from "./EditEligibleCandidateForm";
import DeleteEligibleCandidateForm from "./DeleteEligibleCandidateForm";

interface ManageEligibleCandidateTableViewProps {
  eligibleCandidatesData: EligibleCandidatesSchema[];
  setIsOperationInProgress: React.Dispatch<React.SetStateAction<boolean>>;
}

const ManageEligibleCandidatesTableView: FC<
  ManageEligibleCandidateTableViewProps
> = ({ eligibleCandidatesData, setIsOperationInProgress }) => {
  const columns: ColumnDef<EligibleCandidatesSchema>[] = [
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
      id: "actions",
      header: () => <div>Actions</div>,
      cell: ({ row }) => {
        const eligibleCandidate = row.original;
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
                    }}
                  >
                    edit
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Eligible Candidates</DialogTitle>
                    <DialogDescription>
                      Edit eligible candidates details
                    </DialogDescription>
                  </DialogHeader>
                  <EditEligibleCandidateForm
                    editingEligibleCandidate={eligibleCandidate}
                    setIsOperationInProgress={setIsOperationInProgress}
                  />
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                    }}
                  >
                    delete
                  </DropdownMenuItem>
                </DialogTrigger>
                <DeleteEligibleCandidateForm
                  deletingEligibleCandidate={eligibleCandidate}
                  setIsOperationInProgress={setIsOperationInProgress}
                />
              </Dialog>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      enableHiding: false,
      enableSorting: true,
    },
  ];
  return (
    <EligibleCandidatesDataTable
      columns={columns}
      data={eligibleCandidatesData}
      rowsPerPage={10}
    />
  );
};

export default ManageEligibleCandidatesTableView;
