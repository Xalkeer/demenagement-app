import { Router } from 'express';
import * as notificationsController from '../controllers/notifications.controller';

const router = Router();

router.post('/email', notificationsController.sendManualEmail);

export default router;
