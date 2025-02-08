import {
  create,
  generateForgotPasswordLink,
  grandValid,
  sendNewEmailVerificationToken,
  updatePassword,
  verifyEmail,
} from "#/controllers/user";
import { isValidPasswordResetToken } from "#/middleware/auth";
import { validate } from "#/middleware/validator";

import {
  CreateUserValidationSchema,
  ObjectIdValidationSchema,
  PasswordValidationSchema,
  TokenAndObjectIdValidationSchema,
} from "#/utils/validation/validationSchemas";
import { Router } from "express";

const router = Router();

router.post("/create", validate(CreateUserValidationSchema), create);
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

export default router;
