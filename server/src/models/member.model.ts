import { Document, Schema, model } from "mongoose";

interface SocialUrl extends Document {
  name: "github" | "linkedin" | "twitter" | "facebook" | "instagram" | "custom";
  customName?: string;
  url: string;
}
interface Certificate extends Document {
  eventId: string;
  certificate_code: string;
  certificate_url: string;
  issuedAt: Date;
}

export interface IMember extends Document {
  memberId: string;
  memberName: string;
  email: string;
  password: string;
  gender: "male" | "female" | "other";
  address?: string;
  phone_no?: number;
  member_img?: string;
  social_urls?: SocialUrl[];
  organizations?: string[];
  certificateIds?: string[];
  refresh_token: string;
}

const MemberSchema = new Schema<IMember>(
  {
    memberId: {
      type: String,
      required: true,
    },
    memberName: {
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
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    member_img: {
      type: String,
    },
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
    refresh_token: {
      type: String,
      default: null,
    },
    organizations: [
      {
        type: Schema.Types.ObjectId,
        ref: "Organizations",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default model<IMember>("Members", MemberSchema);
