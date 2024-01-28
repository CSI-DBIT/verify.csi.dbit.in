import { z } from "zod";

export const validationMemberDetailSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  studentId: z.string().length(10),
  branch: z.string(),
  duration: z.string(),
  startDate: z.date(),
});

export type MemberDetailsSchema = z.infer<typeof validationMemberDetailSchema>;
