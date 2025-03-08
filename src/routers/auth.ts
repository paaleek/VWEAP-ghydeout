import {
  create,
  generateForgotPasswordLink,
  grandValid,
  sendNewEmailVerificationToken,
  signIn,
  updatePassword,
  updateProfile,
  verifyEmail,
} from "#/controllers/user";
import { isAuth, isValidPasswordResetToken } from "#/middleware/auth";
import { validate } from "#/middleware/validator";
import User from "#/models/user";

import {
  EmailValidationSchema,
  NameValidationSchema,
  ObjectIdValidationSchema,
  PasswordValidationSchema,
  TokenAndObjectIdValidationSchema,
} from "#/utils/validation/validationSchemas";
import { error } from "console";
import { Response, Router } from "express";

const router = Router();

router.post(
  "/create",
  validate(NameValidationSchema),
  validate(EmailValidationSchema),
  validate(PasswordValidationSchema),
  create
);
router.post(
  "/verify-email",
  validate(PasswordValidationSchema),
  validate(TokenAndObjectIdValidationSchema),
  verifyEmail
);
router.post(
  "/re-verify-email",
  validate(ObjectIdValidationSchema),
  sendNewEmailVerificationToken
);
router.post("/forgot-password", generateForgotPasswordLink);
router.post(
  "/verify-password-reset-token-validity",
  validate(TokenAndObjectIdValidationSchema),
  isValidPasswordResetToken,
  grandValid
);

router.post(
  "/update-password",
  validate(PasswordValidationSchema),
  validate(TokenAndObjectIdValidationSchema),
  isValidPasswordResetToken,
  updatePassword
);

router.post(
  "/sign-in",
  validate(PasswordValidationSchema),
  validate(EmailValidationSchema),
  signIn
);

//this is jsut to verify if the user is or isn't logged in. It does not have functional purpose
router.get("/is-auth", isAuth, (req, res) => {
  console.log("User is authenticated.");

  res.json({
    profile: req.user,
  });
});

import formidable from "formidable";
import path from "path";
import fs from "fs";
import uploadMiddleware, {
  RequestWithFiles,
} from "#/middleware/uploadMiddleware";

router.post(
  "/update-profile",
  isAuth,
  uploadMiddleware("profile_picture", "/profiles"),
  updateProfile
);

export default router;
