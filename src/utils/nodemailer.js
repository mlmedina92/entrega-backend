import nodemailer from "nodemailer";
import config from "../config.js";

export let transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: config.gmail_user,
    pass: config.gmail_password,
  },
  tls: {
    rejectUnauthorized: false, // Ignorar la verificación del certificado
  },
});
