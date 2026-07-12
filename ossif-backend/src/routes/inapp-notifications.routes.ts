import { Router } from 'express';
import * as inappNotificationsController from '../controllers/inapp-notifications.controller';

const router = Router();

router.get('/', inappNotificationsController.getNotifications);
router.put('/read-all', inappNotificationsController.markAllAsRead);
router.put('/:id/read', inappNotificationsController.markAsRead);

export default router;
