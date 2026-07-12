import nodemailer from 'nodemailer';
import 'dotenv/config';

console.log('--- Debug Mailer Config ---');
console.log('SMTP_EMAIL:', process.env.SMTP_EMAIL);
console.log('SMTP_PASSWORD loaded?', !!process.env.SMTP_PASSWORD);
console.log('---------------------------');

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});
