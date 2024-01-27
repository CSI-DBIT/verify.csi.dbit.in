import { ColumnDef } from "@tanstack/react-table"
import { z } from "zod";
export const MemberDetailSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  studentId: z.string().length(10),
  branch: z.string(),
  duration: z.string(),
  startDate: z.date(),
});
type MemberDetails = z.infer<typeof MemberDetailSchema>;


export const columns: ColumnDef<MemberDetails>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "studentID",
    header: "Student Id",
  },
  {
    accessorKey: "branch",
    header: "Branch",
  },
  {
    accessorKey: "duration",
    header: "Duration",
  },
  {
    accessorKey: "startDate",
    header: "Start Date ",
  },
]
