import { RequestHandler } from "express";
import PasswordResetToken from "#/models/passwordResetToken";

export const isValidPasswordResetToken: RequestHandler = async (
  req,
  res,
  next
) => {
  const { token, userId } = req.body;

  const resetToken = await PasswordResetToken.findOne({ owner: userId });

  if (!resetToken) {
    res
      .status(404)
      .json({ error: "Reset token for given userId was not found." });
    return;
  }

  const matched = await resetToken.compareToken(token);
  if (!matched) {
    res.status(403).json({ error: "Unauthorized access, invalid token!" });
    return;
  }

  next();
};
