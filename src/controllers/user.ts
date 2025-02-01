import { RequestHandler } from "express";

import { CreateUser, VerifyEmailRequest } from "#/@types/user";
import User from "#/models/user";
import { generateToken } from "#/utils/helper";
import { sendVerificationMail } from "#/mail/mail";
import EmailVerificationToken from "#/models/emailVerificationToken";

export const create: RequestHandler = async (req: CreateUser, res) => {
  const { email, password, name } = req.body;
  const user = await User.create({ email, password, name });

  //send verification email
  const token = generateToken(10);

  sendVerificationMail(token, { name, email, userId: user._id.toString() }); //here can be wait for sending email

  res.status(201).json({ user: { id: user._id, name, email } });
};

export const verifyEmail: RequestHandler = async (
  req: VerifyEmailRequest,
  res
) => {
  const { token, userId } = req.body;

  const verificationToken = await EmailVerificationToken.findOne({
    owner: userId,
  });

  if (!verificationToken) {
    res.status(403).json({ error: "Verification token is invalid." });
    return;
  }

  const equals = await verificationToken.compareToken(token);

  if (!equals) {
    res.status(403).json({ error: "Verification token is invalid." });
    return;
  }

  await User.findByIdAndUpdate(userId, { verified: true });
  await EmailVerificationToken.findByIdAndDelete(verificationToken._id);

  res.status(200).json({ message: "Email verified successfully." });
};
