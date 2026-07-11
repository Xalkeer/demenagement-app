import { Request, Response } from 'express';
import * as tasksService from '../services/tasks.service';

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await tasksService.getAllTasks();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, completed, listId, priority, date, description, location, assignee } = req.body;
    const task = await tasksService.createTask({ title, completed, listId, priority, date, description, location, assignee });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const task = await tasksService.updateTask(Number(req.params.id), req.body);
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    await tasksService.deleteTask(Number(req.params.id));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
};
