import { FC } from "react";
import { DataTableColumnHeader } from "@/components/reusableComponents/DataTableColumnHeader";
import { ColumnDef } from "@tanstack/react-table";
import {
  Download,
  Eye,
  UserRoundCheck,
  UserRoundMinus,
  UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable from "./DataTable";
import { CertificateDetailsSchema } from "@/validationSchemas/CertificateDetailsSchema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { eventCategoryText, eventTypeText } from "../constants";

interface CertificateTableViewProps {
  certificateData: CertificateDetailsSchema[];
}

const CertificateTableView: FC<CertificateTableViewProps> = ({
  certificateData,
}) => {
  console.log(certificateData);
  const handleDownload = (certificateUrl: string, fileName: string) => {
    const downloadUrl = `${import.meta.env.VITE_SERVER_URL}/${certificateUrl}`;
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns: ColumnDef<CertificateDetailsSchema>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Event name"} />
      ),
      cell: ({ row }) => {
        const eventName = row.getValue("name") as string;
        return <div className="capitalize">{eventName}</div>;
      },
      enableHiding: false,
      enableSorting: true,
    },
    {
      accessorKey: "category",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Category"} />
      ),
      cell: ({ row }) => {
        const category = parseInt(row.getValue("category"), 10);
        const eventCategory = eventCategoryText[category];
        return (
          <div className="flex gap-2 items-center">
            <eventCategory.icon className="text-muted-foreground" />
            {eventCategory.name}
          </div>
        );
      },
      enableHiding: true,
      enableSorting: true,
    },
    {
      accessorKey: "typeOfEvent",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Event type"} />
      ),
      cell: ({ row }) => {
        const type = parseInt(row.getValue("typeOfEvent"), 10);
        const eventType = eventTypeText[type];
        return (
          <div className="flex gap-2 items-center">
            <eventType.icon className="text-muted-foreground" />
            {eventType.name}
          </div>
        );
      },
      enableHiding: true,
      enableSorting: true,
    },
    {
      accessorKey: "startDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Event Date"} />
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
      accessorKey: "isMemberOnly",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Status"} />
      ),
      cell: ({ row }) => {
        const isMemberOnly = row.getValue("isMemberOnly") as boolean;
        if (isMemberOnly) {
          return (
            <div className="flex flex-wrap gap-2">
              <UserRoundCheck />
              <span>Member Only</span>
            </div>
          );
        } else {
          return (
            <div className="flex flex-wrap gap-2">
              <UsersRound />
              <span>Open to all</span>
            </div>
          );
        }
      },
      enableHiding: true,
      enableSorting: true,
    },
    {
      id: "Preview",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Preview"} />
      ),
      cell: ({ row }) => {
        const certificateUrl = row.original;
        console.log(certificateUrl.uniqueCertificateUrl);
        return (
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
                  {certificateUrl.uniqueCertificateUrl.length > 20
                    ? `${certificateUrl.uniqueCertificateUrl.substring(
                        0,
                        20
                      )}...`
                    : certificateUrl.uniqueCertificateUrl}
                </DialogDescription>
                <embed
                  className="w-full h-[600px]"
                  src={`${import.meta.env.VITE_SERVER_URL}/${
                    certificateUrl.uniqueCertificateUrl
                  }`}
                  type="application/pdf"
                />
              </DialogHeader>
            </DialogContent>
          </Dialog>
        );
      },
      enableHiding: true,
      enableSorting: true,
    },
    {
      id: "Download",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Download"} />
      ),
      cell: ({ row }) => {
        const certificateData = row.original;
        return (
          <Button
            variant={"secondary"}
            className="bg-green-800 hover:bg-green-900 w-full flex gap-2 items-center"
            onClick={() =>
              handleDownload(
                certificateData.uniqueCertificateUrl,
                certificateData.name +
                  "_" +
                  certificateData.uniqueCertificateCode
              )
            }
          >
            <Download className="h-4 w-4" />
            <div>Download Certificate</div>
          </Button>
        );
      },
      enableHiding: true,
      enableSorting: true,
    },
  ];
  return (
    <DataTable columns={columns} data={certificateData} rowsPerPage={10} />
  );
};

export default CertificateTableView;
