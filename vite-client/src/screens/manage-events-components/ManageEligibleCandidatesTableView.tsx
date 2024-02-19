import { FC, useState } from "react";
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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import {
  Copy,
  MoreHorizontal,
  UserRoundCheck,
  UserRoundMinus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
// import EditMemberForm from "./EditMemberForm";
import { branchText, currentAcademicYearText } from "../constants";
// import DeleteMemberForm from "./DeleteMemberForm";
import { EligibleCandidatesSchema } from "@/validationSchemas/EligibleCadidatesSchema";
import EligibleCandidatesDataTable from "./EligibleCandidatesDataTable";
import EditEligibleCandidateForm from "./EditEligibleCandidateForm";
import DeleteEligibleCandidateForm from "./DeleteEligibleCandidateForm";
import { toast } from "@/components/ui/use-toast";
import QRCode from "qrcode";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
      accessorKey: "isMember",
      header: () => <div>Membership</div>,
      cell: ({ row }) => {
        const isMember = row.getValue("isMember");
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
      accessorKey: "uniqueCertificateCode",
      header: () => <div>Certificate Code</div>,
      cell: ({ row }) => {
        const uniqueCertificateCode = row.getValue("uniqueCertificateCode");

        return uniqueCertificateCode;
      },
      enableHiding: true,
      enableSorting: true,
    },
    {
      accessorKey: "certificateFileUrl",
      header: () => <div>Certificate</div>,
      cell: ({ row }) => {
        const uniqueCertificateCode = row.getValue("certificateFileUrl");
        return uniqueCertificateCode;
      },
      enableHiding: true,
      enableSorting: true,
    },
    {
      id: "actions",
      header: () => <div>Actions</div>,
      cell: ({ row }) => {
        const eligibleCandidate = row.original;
        const [qrCodeData, setQRCodeData] = useState<string>("");

        const generateQRCode = (data: string) => {
          QRCode.toDataURL(`https://localhost/${data}`).then(setQRCodeData);
        };

        const downloadQRCode = () => {
          const downloadLink = document.createElement("a");
          downloadLink.href = qrCodeData;
          downloadLink.download = `${eligibleCandidate.name}-${eligibleCandidate.uniqueCertificateCode}.png`;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        };

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
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(
                    eligibleCandidate.uniqueCertificateCode as string
                  );
                  toast({
                    title: `Copied : ${
                      eligibleCandidate.uniqueCertificateCode as string
                    }`,
                  });
                }}
              >
                Copy Unique Code
              </DropdownMenuItem>
              <Dialog>
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      generateQRCode(
                        eligibleCandidate.uniqueCertificateCode as string
                      );
                    }}
                  >
                    Generate Qr Code
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Generate Qr Code</DialogTitle>
                    <DialogDescription>
                      Download or Copy Qr Code
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-center items-center">
                    <img
                      src={qrCodeData}
                      alt={qrCodeData}
                      className="rounded"
                    />
                  </div>
                  <Label htmlFor="link" className="sr-only">
                    Qr Code Link
                  </Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      id="link"
                      defaultValue={`https://localhost/${eligibleCandidate.uniqueCertificateCode}`}
                      readOnly
                    />
                    <Button
                      size="sm"
                      className="px-3"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `https://localhost/${eligibleCandidate.uniqueCertificateCode}`
                        );
                        toast({
                          title: `Copied : https://localhost/${eligibleCandidate.uniqueCertificateCode}`,
                        });
                      }}
                    >
                      <span className="sr-only">Copy</span>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button onClick={downloadQRCode} className="w-full">
                    Download QR Code
                  </Button>
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
  return (
    <EligibleCandidatesDataTable
      columns={columns}
      data={eligibleCandidatesData}
      rowsPerPage={10}
    />
  );
};

export default ManageEligibleCandidatesTableView;
