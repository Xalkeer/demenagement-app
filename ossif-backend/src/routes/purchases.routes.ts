import { Router } from 'express';
import * as purchasesController from '../controllers/purchases.controller';

const router = Router();

router.get('/', purchasesController.getAllPurchases);
router.post('/', purchasesController.createPurchase);
router.put('/:id', purchasesController.updatePurchase);
router.delete('/:id', purchasesController.deletePurchase);

export default router;
