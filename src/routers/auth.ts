import { create } from "#/controllers/user";
import { validate } from "#/middleware/validator";

import { CreateUserValidationSchema } from "#/utils/validation/validationSchemas";
import { Router } from "express";

const router = Router();

router.post("/create", validate(CreateUserValidationSchema), create);

export default router;
