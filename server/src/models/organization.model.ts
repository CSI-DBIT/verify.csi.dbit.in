import { Document, Schema, model } from "mongoose";

interface SocialUrl extends Document {
  name: "github" | "linkedin" | "twitter" | "facebook" | "instagram" | "custom";
  customName?: string;
  url: string;
}
interface Member extends Document {
  memberId: string;
  status: "active" | "inactive";
  startDate: Date;
}
interface Event extends Document {
  eventId: string;
}
export interface IOrganization extends Document {
  orgId: string;
  orgName: string;
  description: string;
  email: string;
  password: string;
  logo?: string;
  address?: string;
  phone_no?: number;
  event_categories: string[];
  social_urls: SocialUrl[];
  memberIds: Member[];
  eventIds: Event[];
  refresh_token: string;
}

const OrganizationSchema = new Schema<IOrganization>(
  {
    orgId: {
      type: String,
      required: true,
      unique: true,
    },
    orgName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
    },
    address: {
      type: String,
    },
    phone_no: {
      type: Number,
    },
    event_categories: [
      {
        type: String,
      },
    ],
    social_urls: [
      {
        name: {
          type: String,
          enum: [
            "github",
            "linkedin",
            "twitter",
            "facebook",
            "instagram",
            "custom",
          ],
          required: true,
        },
        customName: {
          type: String,
          validate: {
            validator: function (e: SocialUrl) {
              return (
                e.name !== "custom" || (e.name === "custom" && e.customName)
              );
            },
            message: "customName is required when name is 'custom'",
          },
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    memberIds: [
      {
        memberId: {
          type: Schema.Types.ObjectId,
          ref: "Members",
          required: true,
        },
        status: {
          type: String,
          enum: ["active", "inactive"],
          default: "active",
        },
        startDate: {
          type: Date,
          required: true,
        },
      },
    ],
    eventIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Events",
      },
    ],
    refresh_token: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default model<IOrganization>("Organizations", OrganizationSchema);
