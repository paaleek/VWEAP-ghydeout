import { RequestHandler } from "express";
import nodemailer from "nodemailer";
import path from "path";

import { CreateUser } from "#/@types/user";
import User from "#/models/user";
import EmailVerificationToken from "#/models/emailVerificationToken";
import { config } from "#/utils/variables";
import { generateToken } from "#/utils/helper";
import { generateTemplate } from "#/mail/template";

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

  const token = generateToken(10);
  const verificationToken = await EmailVerificationToken.create({
    owner: user._id,
    token: token,
  });

  const welcomeMessage = `Ahoj ${name}, vitaj v BZZVÁHY. Klikni na tlačidlo a over svoj email.`;

  transport.sendMail({
    to: user.email,
    from: config.SERVER_AUTH_EMAIL,
    html: generateTemplate({
      title: "Vitajte v BZZ VÁHY.",
      message: welcomeMessage,
      logo: "cid:logo",
      banner: "cid:welcome",
      link: "#",
      btnTitle: token,
    }),
    attachments: [
      {
        filename: "logo.png",
        path: path.join(__dirname, "../mail/assets/logo.png"),
        cid: "logo",
      },
      {
        filename: "password_reset.png",
        path: path.join(__dirname, "../mail/assets/password_reset.png"),
        cid: "welcome",
      },
    ],
  });

  res.status(201).json({ user });
};
