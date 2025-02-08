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
    subject: "Uvítacia správa",
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

interface Options {
  email: string;
  link: string;
}

export const sendForgotPasswordLink = async (options: Options) => {
  const transport = getMailTransporter();

  const { email, link } = options;

  const message = `Práve sme obdržali požiadavku na zmenu vášho hesla. Žiaden problém, klikni na link nižšie a vytvor si nové heslo.`;

  transport.sendMail({
    to: email,
    from: config.SERVER_AUTH_EMAIL,
    subject: "Link na obnovu hesla",
    html: generateTemplate({
      title: "Obnova hesla",
      message: message,
      logo: "cid:logo",
      banner: "cid:welcome",
      link: link,
      btnTitle: "Zmeniť heslo",
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

export const sendPasswordResetSuccessEmail = async (
  name: string,
  email: string
) => {
  const transport = getMailTransporter();

  const message = `Vážený ${name} práve sme aktualizovali vaše heslo. Odteraz sa môžete prihlásiť pomocou vašého nového hesla.`;

  transport.sendMail({
    to: email,
    from: config.SERVER_AUTH_EMAIL,
    subject: "Úspešne zmenené heslo",
    html: generateTemplate({
      title: "Úspešne zmenené heslo",
      message: message,
      logo: "cid:logo",
      banner: "cid:welcome",
      link: config.SIGN_IN_URL,
      btnTitle: "Prihlásenie",
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
