import { Request, Response } from 'express';
import * as inappNotificationService from '../services/inapp-notifications.service';

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const notifications = await inappNotificationService.getNotifications();
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const notification = await inappNotificationService.markAsRead(Number(req.params.id));
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};

export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const result = await inappNotificationService.markAllAsRead();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark all as read' });
  }
};
