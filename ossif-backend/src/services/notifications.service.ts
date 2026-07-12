import { getTransporter } from '../config/mailer';

export const sendEmail = async (to: string, subject: string, text: string, html?: string) => {
  const mailOptions = {
    from: `"Achats App" <${process.env.SMTP_EMAIL}>`,
    to: to || process.env.SMTP_TO_EMAILS || process.env.SMTP_EMAIL,
    subject,
    text,
    html,
  };
  const transporter = await getTransporter();
  return await transporter.sendMail(mailOptions);
};
