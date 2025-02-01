import { RequestHandler } from "express";

import { CreateUser } from "#/@types/user";
import User from "#/models/user";
import { generateToken } from "#/utils/helper";
import { sendVerificationMail } from "#/mail/mail";

export const create: RequestHandler = async (req: CreateUser, res) => {
  const { email, password, name } = req.body;
  const user = await User.create({ email, password, name });

  //send verification email
  const token = generateToken(10);

  sendVerificationMail(token, { name, email, userId: user._id.toString() }); //here can be wait for sending email

  res.status(201).json({ user: { id: user._id, name, email } });
};
