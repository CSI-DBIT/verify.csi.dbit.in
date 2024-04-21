import { FC } from "react";
import { DataTableColumnHeader } from "@/components/reusableComponents/DataTableColumnHeader";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, UserRoundCheck, UserRoundMinus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  branchText,
  currentAcademicYearText,
  currentSemesterText,
  durationText,
  eventCategoryText,
  eventTypeText,
  genderText,
} from "../constants";
import DataTable from "./DataTable";
import { CertificateDetailsSchema } from "@/validationSchemas/CertificateDetailsSchema";
import { boolean } from "zod";

interface CertificateTableViewProps {
  certificateData: CertificateDetailsSchema[];
}

const CertificateTableView: FC<CertificateTableViewProps> = ({
  certificateData,
}) => {
  const columns: ColumnDef<CertificateDetailsSchema>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Event name"} />
      ),
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
        const eventCategoryIcon = eventCategoryText[category];
        return (
          <div className="flex gap-2 items-center">
            <eventCategoryIcon.icon className="text-muted-foreground" />
            {eventCategoryText[category].name}
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
        const eventTypeIcon = eventTypeText[type];
        return (
          <div className="flex gap-2 items-center">
            <eventTypeIcon.icon className="text-muted-foreground" />
            {eventTypeText[type].name}
          </div>
        );
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
      accessorKey: "isMemberOnly",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"MemberOnly"} />
      ),
      cell: ({ row }) => {
        const isMemberOnly = row.getValue("isMemberOnly") as boolean;
        if (isMemberOnly) {
          return (
            <div className="flex flex-wrap gap-2">
              <UserRoundCheck color="#07e704" />
              <span>True</span>
            </div>
          );
        } else {
          return (
            <div className="flex flex-wrap gap-2">
              <UserRoundMinus color="#e70404" />
              <span>False</span>
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
      cell: ({ row }) => {},
      enableHiding: true,
      enableSorting: true,
    },
    {
      id: "Download",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Download"} />
      ),
      cell: ({ row }) => {},
      enableHiding: true,
      enableSorting: true,
    },
  ];
  return (
    <DataTable columns={columns} data={certificateData} rowsPerPage={10} />
  );
};

export default CertificateTableView;
