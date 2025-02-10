import { Model, model, ObjectId, Schema } from "mongoose";
import { hash, compare } from "bcrypt";

interface PasswordResetTokenDocument {
  owner: ObjectId;
  token: string;
  createdAt: Date;
}

interface Methods {
  compareToken(token: string): Promise<boolean>;
}

const passwordResetTokenSchema = new Schema<
  PasswordResetTokenDocument,
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
    default: Date.now,
  },
});

passwordResetTokenSchema.pre("save", async function (next) {
  //hash the token before saving to the database
  if (this.isModified("token")) {
    this.token = await hash(this.token, 10);
  }
  next();
});

passwordResetTokenSchema.methods.compareToken = async function (token) {
  // Ensure token length matches the original length (72 characters for a 36-byte hex token)
  if (token.length !== 72) {
    console.log("Token length mismatch. Rejecting.");
    return false;
  }

  const isValid = await compare(token, this.token);
  console.log("Comparison result:", isValid);

  return isValid;
};

export default model("PasswordResetToken", passwordResetTokenSchema) as Model<
  PasswordResetTokenDocument,
  {},
  Methods
>;
