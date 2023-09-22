import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { envs } from '../shared/types';

export const FROM_EMAIL = 'support@plando.com';
type IGetTransporter = () => Promise<nodemailer.Transporter<SMTPTransport.MailOptions>>;

const getProductionTransporter: IGetTransporter = async () => nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GOOGLE_EMAIL,
    pass: process.env.GOOGLE_PASSWORD,
  },
});

const getDevelopmentTransporter: IGetTransporter = async () => nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// eslint-disable-next-line no-unused-vars
const getTransporterStrategies: {[key in envs]: IGetTransporter} = {
  development: getDevelopmentTransporter,
  production: getProductionTransporter,
};

export const sendMail = async (
  mailOptions: {to: string, from: string, subject: string, text: string},
) => {
  const env = (process.env.NODE_ENV || 'development') as envs;
  const strategy = getTransporterStrategies[env];
  const transporter = await strategy();
  return transporter.sendMail(mailOptions);
};
