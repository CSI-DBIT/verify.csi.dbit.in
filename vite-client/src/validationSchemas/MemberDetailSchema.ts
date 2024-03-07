import { z } from "zod";

export const validationMemberDetailSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  mobileNumber: z.string().length(10),
  gender: z.string(),
  studentId: z.string().length(10),
  branch: z.string(),
  currentAcademicYear: z.string(),
  currentSemester: z.string(),
  duration: z.string(),
  startDate: z.date(),
  endDate: z.date().optional(),
  status: z.string().optional(),
});

export type MemberDetailsSchema = z.infer<typeof validationMemberDetailSchema>;
