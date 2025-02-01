import * as yup from "yup";

export const CreateUserValidationSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Name is required parameter")
    .min(3, "Name is too short")
    .max(20, "Name is too long"),
  email: yup
    .string()
    .email("Invalid email")
    .required("Email is required parameter"),
  password: yup
    .string()
    .trim()
    .required("Password is required parameter")
    .min(8, "Password is too short") /* .matches(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/,
      "Password is too simple!"
    ),*/,
});
