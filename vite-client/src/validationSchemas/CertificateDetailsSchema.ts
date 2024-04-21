import { z } from "zod";

export const validationCertificateDetailSchema = z.object({
  eventCode: z.string(),
  uniqueCertificateCode: z.string(),
  uniqueCertificateUrl: z.string(),
  emailSentCount: z.number(),
  name: z.string(),
  category: z.number(),
  typeOfEvent: z.number(),
  branchesAllowed: z.number(),
  academicYearAllowed: z.number(),
  isBranchSpecific: z.boolean(),
  isAcademicYearSpecific: z.boolean(),
  isMemberOnly: z.boolean(),
  startDate: z.date(),
  endDate: z.date(),
  isDeleted: z.boolean(),
});

export type CertificateDetailsSchema = z.infer<
  typeof validationCertificateDetailSchema
>;
