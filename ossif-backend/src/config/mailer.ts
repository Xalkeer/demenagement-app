import nodemailer from 'nodemailer';
import 'dotenv/config';
import dns from 'dns';

// Force Node.js to prefer IPv4 over IPv6 globally for DNS resolutions
dns.setDefaultResultOrder('ipv4first');

console.log('--- Debug Mailer Config ---');
console.log('SMTP_EMAIL:', process.env.SMTP_EMAIL);
console.log('SMTP_PASSWORD loaded?', !!process.env.SMTP_PASSWORD);
console.log('---------------------------');

export const getTransporter = async () => {
  // Force resolution of smtp.gmail.com to an IPv4 address
  const ip = await new Promise<string>((resolve, reject) => {
    dns.lookup('smtp.gmail.com', { family: 4 }, (err, address) => {
      if (err) reject(err);
      else resolve(address);
    });
  });

  return nodemailer.createTransport({
    host: ip,
    port: 587,
    secure: false, // true pour 465, false pour 587
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      servername: 'smtp.gmail.com', // Keep SNI correct for Gmail
      rejectUnauthorized: false
    }
  });
};
