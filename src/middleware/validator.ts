import { RequestHandler } from "express";
import * as yup from "yup";

export const validate = (schema: any): RequestHandler => {
  return async (req, res, next) => {
    //console.log(req.body);
    if (Object.keys(req.body).length == 0) {
      res.status(422).json({ error: "Empty body is not excepted!" });
      return;
    }
    const schemaToValidate = yup.object({
      body: schema,
    });

    try {
      await schemaToValidate.validate(
        {
          body: req.body,
        },
        {
          abortEarly: true,
        }
      );

      next();
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        res.status(422).json({ error: error.message });
      } else {
        res
          .status(500)
          .json({ error: "Error while validating", body: req.body });
      }
    }
  };
};
