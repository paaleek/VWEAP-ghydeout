import * as yup from "yup";
import { isValidObjectId } from "mongoose";

declare module "yup" {
  interface StringSchema {
    isValidObjectId(message?: string): this;
  }
}

yup.addMethod(yup.string, "isValidObjectId", function (errorMessage) {
  return this.test(`test-objectId-validity`, errorMessage, function (value) {
    const { path, createError } = this;

    if (!value || !isValidObjectId(value)) {
      return createError({ path, message: errorMessage });
    }
    return true;
  });
});

// ------------schemas
export const PasswordValidationSchema = yup.object({
  password: yup
    .string()
    .trim()
    .required("Password is required parameter")
    .min(8, "Password is too short") /* .matches(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/,
      "Password is too simple!"
    ),*/,
});

export const EmailValidationSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email")
    .required("Email is required parameter"),
});

export const NameValidationSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Name is required parameter")
    .min(3, "Name is too short")
    .max(20, "Name is too long"),
});

export const TokenAndObjectIdValidationSchema = yup.object({
  token: yup.string().trim().required("Token is required field."),
  userId: yup
    .string()
    .required("userId is required field")
    .isValidObjectId("userId is not a valid ObjectId"),
});

export const ObjectIdValidationSchema = yup.object({
  userId: yup
    .string()
    .required("userId is required field")
    .isValidObjectId("userId is not a valid ObjectId"),
});
