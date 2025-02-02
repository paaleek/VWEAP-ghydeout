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

  //create token in DB
  await EmailVerificationToken.create({
    owner: user._id,
    token: token,
  });

  sendVerificationMail(token, {
    name: user.name,
    email: user.email,
  }); //here can be wait for sending email

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

export const sendNewEmailVerificationToken: RequestHandler = async (
  req,
  res
) => {
  const { userId } = req.body;

  //find user by Id
  const user = await User.findById(userId);

  if (!user) {
    res.status(400).json({ message: "User with given userId does not exists" });
    return;
  }

  if (user.verified) {
    res.status(405).json({
      message:
        "User with given userId already does have verified email address.",
    });
    return;
  }

  await EmailVerificationToken.deleteMany({
    owner: userId,
  });

  //generate new token
  const token = generateToken(10);

  //create token in DB
  await EmailVerificationToken.create({
    owner: userId,
    token: token,
  });

  sendVerificationMail(token, {
    name: user.name,
    email: user.email,
  });

  res.status(201).json({
    message: "New email has been sent, please check your email inbox.",
  });
};
