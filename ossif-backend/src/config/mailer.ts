import nodemailer from 'nodemailer';
import 'dotenv/config';
import dns from 'dns';

// Force Node.js to prefer IPv4 over IPv6 globally for DNS resolutions
dns.setDefaultResultOrder('ipv4first');

console.log('--- Debug Mailer Config ---');
console.log('SMTP_EMAIL:', process.env.SMTP_EMAIL);
console.log('SMTP_PASSWORD loaded?', !!process.env.SMTP_PASSWORD);
console.log('---------------------------');

export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false
  },
  family: 4
} as any);
