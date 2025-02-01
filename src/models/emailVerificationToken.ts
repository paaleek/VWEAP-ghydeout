import { Model, model, ObjectId, Schema } from "mongoose";

interface EmailVerificationTokenDocument {
  owner: ObjectId;
  token: string;
  createdAt: Date;
}

const emailVerificationTokenSchema = new Schema<EmailVerificationTokenDocument>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    token: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      expires: 3600, // expires in one hour 60 min * 60s
      default: Date.now(),
    },
  }
);

export default model(
  "EmailVerificationTokenSchema",
  emailVerificationTokenSchema
) as Model<EmailVerificationTokenDocument>;
