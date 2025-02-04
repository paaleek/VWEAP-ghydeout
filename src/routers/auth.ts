import {
  create,
  generateForgotPasswordLink,
  isValidPasswordResetToken,
  sendNewEmailVerificationToken,
  verifyEmail,
} from "#/controllers/user";
import { validate } from "#/middleware/validator";

import {
  CreateUserValidationSchema,
  ObjectIdValidationSchema,
  TokenAndObjectIdValidationSchema,
} from "#/utils/validation/validationSchemas";
import { Router } from "express";

const router = Router();

router.post("/create", validate(CreateUserValidationSchema), create);
router.post(
  "/verify-email",
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
  isValidPasswordResetToken
);

export default router;
