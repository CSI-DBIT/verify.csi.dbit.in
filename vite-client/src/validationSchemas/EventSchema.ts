import { z } from "zod";

export const validationEventSchema = z.object({
  eventCode: z.string().optional(),
  name: z.string().min(2).max(50),
  category: z.string(),
  typeOfEvent: z.string(),
  branchesAllowed: z.string(),
  academicYearAllowed: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  isMemberOnly: z.boolean(),
});

export type EventSchema = z.infer<typeof validationEventSchema>;
