import { z } from "zod";

export const validationEventSchema = z.object({
  name: z.string().min(2).max(50),
  category: z.string(),
  typeOfEvent: z.string(),
  isMemberOnly: z.boolean(),
  branchesAllowed: z.string(),
  academicYearAllowed: z.string(),
  dateOfCompletion: z.date(),
});

export type EventSchema = z.infer<typeof validationEventSchema>;
