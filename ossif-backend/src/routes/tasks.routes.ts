import { Router } from 'express';
import * as tasksController from '../controllers/tasks.controller';

const router = Router();

router.get('/', tasksController.getAllTasks);
router.post('/', tasksController.createTask);
router.put('/:id', tasksController.updateTask);
router.delete('/:id', tasksController.deleteTask);

export default router;
