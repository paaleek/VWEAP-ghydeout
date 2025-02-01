import { RequestHandler } from "express";
import nodemailer from "nodemailer";

import { CreateUser } from "#/@types/user";
import User from "#/models/user";
import { config } from "#/utils/variables";

export const create: RequestHandler = async (req: CreateUser, res) => {
  const { email, password, name } = req.body;
  const user = await User.create({ email, password, name });

  //send verifycation email
  var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: config.MAILTRAP_USER,
      pass: config.MAILTRAP_PASSWORD,
    },
  });

  transport.sendMail({
    to: user.email,
    from: config.SERVER_AUTH_EMAIL,
    html: "<h1>12345<h1>",
  });

  res.status(201).json({ user });
};
