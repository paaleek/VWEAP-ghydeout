import { Model, model, ObjectId, Schema } from "mongoose";
import { hash, compare } from "bcrypt";

interface EmailVerificationTokenDocument {
  owner: ObjectId;
  token: string;
  createdAt: Date;
}

interface Methods {
  compareToken(token: string): Promise<boolean>;
}

const emailVerificationTokenSchema = new Schema<
  EmailVerificationTokenDocument,
  {},
  Methods
>({
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
});

emailVerificationTokenSchema.pre("save", async function (next) {
  //hash the token before saving to the database
  if (this.isModified("token")) {
    this.token = await hash(this.token, 10);
  }
  next();
});

emailVerificationTokenSchema.methods.compareToken = async function (token) {
  const equals = await compare(token, this.token);
  return equals;
};

export default model(
  "EmailVerificationTokenSchema",
  emailVerificationTokenSchema
) as Model<EmailVerificationTokenDocument, {}, Methods>;
