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
  FileDown,
  FileX2,
  MailCheck,
  MailX,
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
import { useDropzone } from "react-dropzone";

interface ManageEligibleCandidateTableViewProps {
  eligibleCandidatesData: EligibleCandidatesSchema[];
  setIsOperationInProgress: React.Dispatch<React.SetStateAction<boolean>>;
  eventCode: string;
}

const ManageEligibleCandidatesTableView: FC<
  ManageEligibleCandidateTableViewProps
> = ({ eligibleCandidatesData, setIsOperationInProgress, eventCode }) => {
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
      header: () => <div>Event Certificates</div>,
      cell: ({ row }) => {
        const uniqueCertificateUrl = row.getValue(
          "uniqueCertificateUrl"
        ) as string;
        const uniqueCertificateCode = row.getValue("uniqueCertificateCode");
        const email = row.getValue("email");
        const isMember = row.getValue("isMember");
        const [selectedCertificateFile, setSelectedCertificateFile] =
          useState<File | null>(null);
        const [isCertificateDragActive, setIsCertificateDragActive] =
          useState(false);
        const [isCertificateUploading, setIsCertificateUploading] =
          useState(false);
        const deleteCertificate = async () => {
          try {
            setIsCertificateUploading(true);
            setIsOperationInProgress(true);
            const response = await axios.put(
              `${
                import.meta.env.VITE_SERVER_URL
              }/api/eligible-candidate/certificate/delete`,
              {
                eventCode: eventCode,
                uniqueCertificateCode: uniqueCertificateCode,
                uniqueCertificateUrl: uniqueCertificateUrl,
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
            setIsCertificateUploading(false);
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
                }
              );
              if (response.data.success) {
                toast({
                  title: response.data.message,
                });
              } else {
                toast({
                  title: response.data.message,
                  variant: "destructive",
                });
              }
            } catch (error) {
              console.error("Error uploading file:", error);
              toast({
                title: "Unexpected error:",
                variant: "destructive",
              });
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
        const onDrop = async (acceptedFiles: File[]) => {
          setIsCertificateDragActive(false);
          const file = acceptedFiles[0];
          if (!file) {
            toast({
              title: "Wrong file type | expected .pdf",
              variant: "destructive",
            });
          }
          setSelectedCertificateFile(file);
        };

        const { getRootProps, getInputProps } = useDropzone({
          onDrop,
          accept: {
            "application/pdf": [".pdf"],
          },
          onDragEnter: () => {
            setIsCertificateDragActive(true);
          },
          onDragLeave: () => {
            setIsCertificateDragActive(false);
          },
        });

        if (!uniqueCertificateUrl) {
          return (
            <div>
              {!selectedCertificateFile && (
                <div
                  className={`flex gap-2 items-center py-2 px-4 border-dashed hover:border-green-600 border-2 rounded-3xl text-center cursor-pointer ${
                    isCertificateDragActive ? "border-green-600" : ""
                  } `}
                  {...getRootProps()}
                >
                  <input {...getInputProps()} />
                  <FileDown />
                  <p className="text-gray-400">Drop Certificate</p>
                </div>
              )}
              {selectedCertificateFile && (
                <div className="flex items-center justify-between gap-2">
                  <Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <div>
                            {selectedCertificateFile.name.length > 20
                              ? `${selectedCertificateFile.name.substring(
                                  0,
                                  20
                                )}...`
                              : selectedCertificateFile.name}
                          </div>
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
                            disabled={isCertificateUploading}
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
                      {uniqueCertificateUrl.length > 20
                        ? `${uniqueCertificateUrl.substring(0, 20)}...`
                        : uniqueCertificateUrl}
                    </DialogDescription>
                    <embed
                      className="w-full h-[600px]"
                      src={`${
                        import.meta.env.VITE_SERVER_URL
                      }/${uniqueCertificateUrl}`}
                      type="application/pdf"
                    />
                  </DialogHeader>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Button size={"icon"} variant={"destructive"}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Permanently Delete Certificate</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Permanantly Delete Certificate</DialogTitle>
                    <DialogDescription>
                      This will permanently delete certificates and remove your
                      data from our servers.
                      <p>
                        <strong>This action cannot be undone.</strong>
                      </p>
                    </DialogDescription>
                  </DialogHeader>
                  <div>
                    <Button
                      className="w-full"
                      variant={"destructive"}
                      onClick={deleteCertificate}
                    >
                      Confirm Delete
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          );
        }
      },
      enableHiding: true,
      enableSorting: true,
    },
    {
      accessorKey: "emailSentCount",
      header: () => <div>Email</div>,
      cell: ({ row }) => {
        const emailSentCount = Number(row.getValue("emailSentCount"));
        if (emailSentCount && emailSentCount > 0) {
          return (
            <div className="flex gap-2 items-center">
              <MailCheck color="#07e704" /> <span>Sent</span>
            </div>
          );
        } else {
          return (
            <div className="flex gap-2 items-center">
              <MailX color="#F7D100" />
              <span>Not Sent</span>
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
        const candidateEmail = eligibleCandidate.email;
        const [qrCodeData, setQRCodeData] = useState<string>("");
        const downloadQRCode = () => {
          const downloadLink = document.createElement("a");
          downloadLink.href = qrCodeData;
          downloadLink.download = `${eligibleCandidate.name}-${eligibleCandidate.uniqueCertificateCode}.png`;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        };
        const [isSendingEmail, setIsSendingEmail] = useState(false);
        const sendCertificateMail = async (): Promise<void> => {
          try {
            setIsSendingEmail(true);
            const response = await axios.post(
              `${
                import.meta.env.VITE_SERVER_URL
              }/api/event/send-certificate-emails/single?eventCode=${eventCode}&candidateEmail=${candidateEmail}&currentDate=${new Date()}`,
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            if (response.data.success) {
              toast({
                title: response.data.message,
              });
            } else {
              toast({
                title: response.data.message,
                variant: "destructive",
              });
            }
            setIsSendingEmail(false);
            setIsOperationInProgress(true);
          } catch (error) {
            toast({
              title: "unexpected error",
              variant: "destructive",
            });
            console.error("Error sending request to server:", error);
            setIsSendingEmail(false);
          }
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
              <EditEligibleCandidateForm
                editingEligibleCandidate={eligibleCandidate}
                setIsOperationInProgress={setIsOperationInProgress}
                eventCode={eventCode}
              />
              <DeleteEligibleCandidateForm
                deletingEligibleCandidate={eligibleCandidate}
                setIsOperationInProgress={setIsOperationInProgress}
              />
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
              <DropdownMenuItem
                disabled={isSendingEmail}
                onClick={() => sendCertificateMail()}
              >
                {isSendingEmail ? "Sending Email..." : "Send Email"}
              </DropdownMenuItem>
              <Dialog>
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      QRCode.toDataURL(
                        `${
                          import.meta.env.VITE_CLIENT_URL
                        }/certificate/validate/${
                          eligibleCandidate.uniqueCertificateCode
                        }`
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
                      defaultValue={`${
                        import.meta.env.VITE_CLIENT_URL
                      }/certificate/validate/${
                        eligibleCandidate.uniqueCertificateCode
                      }`}
                      readOnly
                    />
                    <Button
                      size="sm"
                      className="px-3"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${
                            import.meta.env.VITE_CLIENT_URL
                          }/certificate/validate/${
                            eligibleCandidate.uniqueCertificateCode
                          }`
                        );
                        toast({
                          title: `Copied : ${
                            import.meta.env.VITE_CLIENT_URL
                          }/certificate/validate/${
                            eligibleCandidate.uniqueCertificateCode
                          }`,
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
