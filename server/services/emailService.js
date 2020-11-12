"use strict";
import nodemailer from "nodemailer";
import env from "../config/index.js";

function writeMail(data) {
  return `<h2> TyFlow has a new version available! </h2>
    <p><b>New version:</b> ${data.new_version}</p>
    <p><b>Old version:</b> ${data.current_version}</p>
    <p>Go to machine@machine to finish the update!</p>`;
}

function sendEmail(data) {
  let transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "da3ed0b6a4532f",
      pass: "5a115d8200c03a",
    },
  });

  //   let transport = nodemailer.createTransport({
  //     host: "ssl0.ovh.net",
  //     port: 2525,
  //     auth: {
  //       user: "it@st-louis.tv",
  //       pass: env.email_password,
  //     },
  //   });

  let mailOptions = {
    from: '"AutoFlow" <it@st-louis.tv>',
    to: "arthur.georget@st-louis.tv, tibor.bernard@st-louis.tv",
    subject: "AutoFlow@Bot - New Version",
    html: writeMail(data),
  };

  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(`Couldn't send email => ${error}`);
    }
    console.log(`Message sent ${info.messageId}`);
  });
}

export { sendEmail };
