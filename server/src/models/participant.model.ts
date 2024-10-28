import { Document, Schema, model } from "mongoose";

export interface IParticipant extends Document {
  eventId: string;
  name: string;
  email: string;
  isMember: "yes" | "no";
  certificateId?: string;
}
