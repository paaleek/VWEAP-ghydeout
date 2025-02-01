import { create, verifyEmail } from "#/controllers/user";
import { validate } from "#/middleware/validator";

import { CreateUserValidationSchema } from "#/utils/validation/validationSchemas";
import { Router } from "express";

const router = Router();

router.post("/create", validate(CreateUserValidationSchema), create);
router.post("/verify-email", verifyEmail);

export default router;
