import { Router } from 'express';
import * as battlepassController from '../controllers/battlepass.controller';

const router = Router();

router.get('/active', battlepassController.getActiveBattlePass);
router.post('/', battlepassController.createBattlePass);

export default router;
