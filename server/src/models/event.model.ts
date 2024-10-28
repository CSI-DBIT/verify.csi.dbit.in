import { Document, Schema, model } from "mongoose";

interface Participant extends Document {
  participantId: string;
}
export interface IEvent extends Document {
  orgId: string;
  eventId: string;
  eventName: string;
  description: string;
  event_banner_img?: string;
  category: string;
  isMemberOnly: "yes" | "no";
  event_date: Date;
  registration_url?: string;
  report_url?: string;
  participantIds?: Participant[];
}
