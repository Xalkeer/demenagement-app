import { Router } from 'express';
import * as listsController from '../controllers/lists.controller';

const router = Router();

router.get('/', listsController.getAllLists);
router.post('/', listsController.createList);
router.delete('/:id', listsController.deleteList);

export default router;
