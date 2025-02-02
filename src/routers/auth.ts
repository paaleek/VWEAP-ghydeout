import {
  create,
  sendNewEmailVerificationToken,
  verifyEmail,
} from "#/controllers/user";
import { validate } from "#/middleware/validator";

import {
  CreateUserValidationSchema,
  SendnEmailVerificationAgainBodySchema,
  VerificationEmailBodySchema,
} from "#/utils/validation/validationSchemas";
import { Router } from "express";

const router = Router();

router.post("/create", validate(CreateUserValidationSchema), create);
router.post(
  "/verify-email",
  validate(VerificationEmailBodySchema),
  verifyEmail
);
router.post(
  "/re-verify-email",
  validate(SendnEmailVerificationAgainBodySchema),
  sendNewEmailVerificationToken
);

export default router;
