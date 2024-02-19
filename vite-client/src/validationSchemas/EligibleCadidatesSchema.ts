import { z } from "zod";

export const validationEligibleCandidateSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  mobileNumber: z.string().length(10),
  branch: z.string(),
  currentAcademicYear: z.string(),
  isMember:z.boolean().optional(),
  uniqueCertificateCode:z.string().optional(),
  certificateFileUrl:z.string().optional(),
});

export type EligibleCandidatesSchema = z.infer<typeof validationEligibleCandidateSchema>;
