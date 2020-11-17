"use strict";
import nodemailer from "nodemailer";
import { google } from "googleapis";
import env from "../config/index.js";
const OAuth2 = google.auth.OAuth2;

function writeMail(data) {
  const cudaText =
    data.new_cuda == data.current_cuda
      ? `<p> CUDA is up to date : ${data.new_cuda} </p>`
      : `<p> CUDA has a new version : ${data.new_cuda} </p>`;

  return `<h2> TyFlow has a new version available! </h2>
    <p><b>New version:</b> ${data.new_version}</p>
    <p><b>Old version:</b> ${data.current_version}</p>
    ${cudaText}
    <p>Go to machine@machine to finish the update!</p>`;
}

function sendEmail(data) {
  const oauth2Client = new OAuth2(
    env.auth_client_id,
    env.auth_client_secret,
    env.auth_redirect_url
  );

  oauth2Client.setCredentials({
    refresh_token: env.auth_refresh_token,
  });

  const accessToken = oauth2Client.getAccessToken();

  const smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: env.email_adress,
      clientId: env.auth_client_id,
      clientSecret: env.auth_client_secret,
      refreshToken: env.auth_refresh_token,
      accessToken: accessToken,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: env.email_adress,
    to: "hadrien195@hotmail.fr",
    subject: "AutoFlow@Bot - New Version",
    html: writeMail(data),
  };

  smtpTransport.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(`Couldn't send email => ${error}`);
    }
    console.log(`Message sent ${info.messageId}`);
  });
}

export { sendEmail };
