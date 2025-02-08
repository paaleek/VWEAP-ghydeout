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
    console.log("Before hashing:", this.token);
    this.token = await hash(this.token, 10);
    console.log("After hashing:", this.token);
  }
  next();
});

passwordResetTokenSchema.methods.compareToken = async function (token) {
  console.log("Raw token:", token);
  console.log("Hashed token from DB:", this.token);
  const equals = await compare(token, this.token);
  console.log("Comparison result:", equals);
  return equals;
};

export default model("PasswordResetToken", passwordResetTokenSchema) as Model<
  PasswordResetTokenDocument,
  {},
  Methods
>;
