import nodemailer from "nodemailer";
import path from "path";

import { config } from "#/utils/variables";
import { generateTemplate } from "#/mail/template";

const getMailTransporter = () => {
  //send verifycation email
  return nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: config.MAILTRAP_USER,
      pass: config.MAILTRAP_PASSWORD,
    },
  });
};

interface Profile {
  name: string;
  email: string;
}

export const sendVerificationMail = async (token: string, profile: Profile) => {
  const transport = getMailTransporter();

  const { name, email } = profile;

  const welcomeMessage = `Ahoj ${name}, vitaj v BZZVÁHY. Klikni na tlačidlo a over svoj email.`;

  transport.sendMail({
    to: email,
    from: config.SERVER_AUTH_EMAIL,
    html: generateTemplate({
      title: "Vitajte v BZZVÁHY.",
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
};
