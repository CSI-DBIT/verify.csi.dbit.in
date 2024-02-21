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
  Eye,
  FileX2,
  MoreHorizontal,
  Trash2,
  Upload,
  UserRoundCheck,
  UserRoundMinus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { branchText, currentAcademicYearText } from "../constants";
import { EligibleCandidatesSchema } from "@/validationSchemas/EligibleCadidatesSchema";
import EligibleCandidatesDataTable from "./EligibleCandidatesDataTable";
import EditEligibleCandidateForm from "./EditEligibleCandidateForm";
import DeleteEligibleCandidateForm from "./DeleteEligibleCandidateForm";
import { toast } from "@/components/ui/use-toast";
import QRCode from "qrcode";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios, { AxiosError } from "axios";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ManageEligibleCandidateTableViewProps {
  eligibleCandidatesData: EligibleCandidatesSchema[];
  setIsOperationInProgress: React.Dispatch<React.SetStateAction<boolean>>;
  eventCode: string;
}

const ManageEligibleCandidatesTableView: FC<
  ManageEligibleCandidateTableViewProps
> = ({ eligibleCandidatesData, setIsOperationInProgress, eventCode }) => {
  const [qrCodeData, setQRCodeData] = useState<string>("");
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
            <div className="flex items-center gap-2">
              <UserRoundCheck color="#07e704" />
              <span>Member</span>
            </div>
          );
        } else {
          return (
            <div className="flex items-center gap-2">
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
      accessorKey: "uniqueCertificateUrl",
      header: () => <div>Certificate</div>,
      cell: ({ row }) => {
        const certificateFileUrl = row.getValue(
          "uniqueCertificateUrl"
        ) as string;
        const uniqueCertificateCode = row.getValue("uniqueCertificateCode");
        const email = row.getValue("email");
        const isMember = row.getValue("isMember");
        const [selectedCertificateFile, setSelectedCertificateFile] =
          useState<File | null>(null);
        const [uploadCertificateProgress, setUploadCertificateProgress] =
          useState<number>(0);
        const deleteCertificate = async () => {
          try {
            setIsOperationInProgress(true);
            const response = await axios.put(
              `${
                import.meta.env.VITE_SERVER_URL
              }/api/eligible-candidate/certificate/delete`,
              {
                eventCode: eventCode,
                uniqueCertificateCode: uniqueCertificateCode,
                uniqueCertificateUrl: certificateFileUrl,
                isMember: isMember,
                currentDate: new Date(),
              }
            );
            toast({
              title: response.data.message,
            });
          } catch (error) {
            console.error("Error deleting file:", error);
            if (axios.isAxiosError(error)) {
              const axiosError = error as AxiosError;
              const errorMessage =
                axiosError.response?.data?.error || "Unknown error";
              toast({
                title: errorMessage,
                variant: "destructive",
              });
            }
            toast({
              title: "Unexpected error:",
              variant: "destructive",
            });
            console.error("Unexpected error:", error);
          } finally {
            setSelectedCertificateFile(null);
          }
        };
        const uploadCertificate = async (
          email: string,
          isMember: string,
          eventCode: string,
          uniqueCertificateCode: string
        ) => {
          if (selectedCertificateFile) {
            const formData = new FormData();
            formData.append("email", email);
            formData.append("isMember", String(isMember));
            formData.append("eventCode", String(eventCode));
            formData.append(
              "uniqueCertificateCode",
              String(uniqueCertificateCode)
            );
            formData.append("currentDate", String(new Date()));
            formData.append("candidate_certificate", selectedCertificateFile);
            try {
              setIsOperationInProgress(true);
              const response = await axios.post(
                `${
                  import.meta.env.VITE_SERVER_URL
                }/api/eligible-candidate/certificate/upload`,
                formData,
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                  onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                      (progressEvent.loaded * 100) / (progressEvent.total || 1)
                    );
                    setUploadCertificateProgress(percentCompleted);
                  },
                }
              );
              toast({
                title: response.data.message,
              });
            } catch (error) {
              console.error("Error uploading file:", error);
              if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                const errorMessage =
                  axiosError.response?.data?.error || "Unknown error";
                toast({
                  title: errorMessage,
                  variant: "destructive",
                });
              }

              toast({
                title: "Unexpected error:",
                variant: "destructive",
              });
              console.error("Unexpected error:", error);
            } finally {
              setSelectedCertificateFile(null);
            }
          } else {
            toast({
              title: "No file selected",
              variant: "destructive",
            });
          }
        };
        if (!certificateFileUrl) {
          return (
            <div>
              {!selectedCertificateFile && (
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={(e) =>
                    setSelectedCertificateFile(e.target.files?.[0] || null)
                  }
                />
              )}
              {selectedCertificateFile && (
                <div className="flex items-center justify-between gap-2">
                  <Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          {selectedCertificateFile.name.length > 20
                            ? `${selectedCertificateFile.name.substring(
                                0,
                                20
                              )}...`
                            : selectedCertificateFile.name}
                        </TooltipTrigger>
                        <TooltipContent>
                          {selectedCertificateFile.name}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <div className="flex gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Dialog>
                            <DialogTrigger>
                              <Button
                                size={"icon"}
                                // onClick={previewUploadedCertificate}
                                variant={"ghost"}
                                className="bg-blue-800 hover:bg-blue-900"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Preview Certificate</DialogTitle>
                                <DialogDescription>
                                  {selectedCertificateFile.name.length > 20
                                    ? `${selectedCertificateFile.name.substring(
                                        0,
                                        20
                                      )}...`
                                    : selectedCertificateFile.name}
                                </DialogDescription>
                                <embed
                                  src={URL.createObjectURL(
                                    selectedCertificateFile
                                  )}
                                  type="application/pdf"
                                  width="100%"
                                  height="600px"
                                />
                              </DialogHeader>
                            </DialogContent>
                          </Dialog>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Preview Document</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Button
                            size={"icon"}
                            onClick={() => setSelectedCertificateFile(null)}
                            variant={"ghost"}
                            className="bg-red-800 hover:bg-red-900"
                          >
                            <FileX2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Remove Document</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Button
                            size={"icon"}
                            onClick={() =>
                              uploadCertificate(
                                email as string,
                                isMember as string,
                                eventCode as string,
                                uniqueCertificateCode as string
                              )
                            }
                            variant={"ghost"}
                            className="bg-green-800 hover:bg-green-900"
                          >
                            <Upload className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Upload Document</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              )}
            </div>
          );
        } else {
          return (
            <div className="flex gap-2 items-center justify-between">
              <Dialog>
                <DialogTrigger className="w-full">
                  <Button
                    // onClick={previewUploadedCertificate}
                    variant={"secondary"}
                    className="bg-blue-800 hover:bg-blue-900 w-full flex gap-2 items-center"
                  >
                    <Eye className="h-4 w-4" />
                    <div>Preview Certificate</div>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Preview Certificate</DialogTitle>
                    <DialogDescription>
                      {certificateFileUrl.length > 20
                        ? `${certificateFileUrl.substring(0, 20)}...`
                        : certificateFileUrl}
                    </DialogDescription>
                    <embed
                      className="w-full h-[600px]"
                      src={`${
                        import.meta.env.VITE_SERVER_URL
                      }/${certificateFileUrl}`}
                      type="application/pdf"
                    />
                  </DialogHeader>
                </DialogContent>
              </Dialog>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      onClick={deleteCertificate}
                      size={"icon"}
                      variant={"destructive"}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete Certificate</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
        const eligibleCandidate = row.original;

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
                      QRCode.toDataURL(
                        `https://localhost/${eligibleCandidate.uniqueCertificateCode}`
                      ).then(setQRCodeData);
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
