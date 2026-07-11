import { Request, Response } from 'express';
import * as notificationsService from '../services/notifications.service';

export const sendManualEmail = async (req: Request, res: Response) => {
  const { subject, text, html, to } = req.body;
  try {
    const info = await notificationsService.sendEmail(
      to,
      subject || 'Notification de votre application Achats',
      text || 'Ceci est un test de notification.',
      html
    );
    res.json({ success: true, messageId: info.messageId });
  } catch (error: any) {
    res.status(500).json({ error: 'Erreur lors de l\'envoi de l\'email', details: error.message });
  }
};
