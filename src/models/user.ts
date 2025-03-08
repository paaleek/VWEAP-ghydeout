import { compare, hash } from "bcrypt";
import { Model, model, Schema } from "mongoose";

interface UserDocument {
  name: string;
  email: string;
  password: string;
  verified: boolean;
  tokens: string[];
  avatar?: string;
}

interface Methods {
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<UserDocument, {}, Methods>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    tokens: {
      type: [String],
    },
    avatar: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  //hash the token before saving to the database
  if (this.isModified("password")) {
    this.password = await hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function (password) {
  const equals = await compare(password, this.password);
  return equals;
};

export default model("User", userSchema) as Model<UserDocument, {}, Methods>;
