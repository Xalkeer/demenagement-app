import { Router } from 'express';
import listsRoutes from './lists.routes';
import tasksRoutes from './tasks.routes';
import purchasesRoutes from './purchases.routes';
import notificationsRoutes from './notifications.routes';
import { importPurchases } from '../controllers/purchases.controller';

const router = Router();

router.use('/lists', listsRoutes);
router.use('/tasks', tasksRoutes);
router.use('/purchases', purchasesRoutes);
router.use('/notifications', notificationsRoutes);

// Import is technically related to purchases
router.post('/import', importPurchases);

export default router;
