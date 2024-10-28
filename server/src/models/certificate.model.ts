import { Document, Schema, model } from "mongoose";

export interface ICertificate extends Document {
  certificate_code: string;
  certificate_url: string;
  issuedAt: Date;
}