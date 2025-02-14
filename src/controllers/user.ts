import { RequestHandler } from "express";
import jwt, { JwtPayload, verify } from "jsonwebtoken";

import { CreateUser, VerifyEmailRequest } from "#/@types/user";
import User from "#/models/user";
import { generateToken } from "#/utils/helper";
import {
  sendForgotPasswordLink,
  sendPasswordResetSuccessEmail,
  sendVerificationMail,
} from "#/mail/mail";
import EmailVerificationToken from "#/models/emailVerificationToken";
import PasswordResetToken from "#/models/passwordResetToken";
import crypto from "crypto";
import { config } from "#/utils/variables";

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

export const generateForgotPasswordLink: RequestHandler = async (req, res) => {
  const { email } = req.body;

  //find user by email
  const user = await User.findOne({ email: email });

  //raise exception if user with given email does not exists
  if (!user) {
    res.status(404).json({ message: "User with given email does not exists" });
    return;
  }

  //delete any previously created reset tokens
  await PasswordResetToken.deleteMany({
    owner: user._id,
  });

  const token = crypto.randomBytes(36).toString("hex");

  await PasswordResetToken.create({
    owner: user._id,
    token: token,
  });

  const resetLink = `${config.PASSWORD_RESET_LINK}?token=${token}&userId=${user._id}`;

  sendForgotPasswordLink({ email, link: resetLink });

  res.status(200).json({ message: "Password reset link has been sent." });
};

export const grandValid: RequestHandler = (req, res) => {
  res.json({ valid: true });
};

export const updatePassword: RequestHandler = async (req, res) => {
  const { password, userId } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    res.status(403).json({ error: "Unauthorized access!" });
    return;
  }

  const matched = await user.comparePassword(password);
  if (matched) {
    res
      .status(422)
      .json({ error: "New password must be different to the old one!" });
    return;
  }

  user.password = password;
  await user.save();

  await PasswordResetToken.deleteMany({ owner: user._id });

  //send success email
  sendPasswordResetSuccessEmail(user.name, user.email);

  res.status(200).json({ message: "Password reset succeessfully." });
};

export const signIn: RequestHandler = async (req, res) => {
  const { password, email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(403).json({ error: "Email/Password mismatch!" });
    return;
  }

  //comapare the pasword
  const matched = await user.comparePassword(password);
  if (!matched) {
    res.status(403).json({ error: "Email/Password mismatch!" });
    return;
  }

  //generate token for later use
  const token = jwt.sign({ userId: user._id }, config.JWT_SECRET, {
    expiresIn: "5min",
  });
  user.tokens.push(token);
  await user.save();

  res.json({
    profile: {
      id: user._id,
      name: user.name,
      email: user.email,
      verified: user.verified,
    },
    token,
  });
};
