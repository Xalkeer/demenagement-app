import prisma from '../config/database';
import { updateBattlePassProgress } from './battlepass.service';

export const getAllTasks = async () => {
  return await prisma.task.findMany({ include: { list: true } });
};

export const createTask = async (data: any) => {
  // If task is created as completed (rare but possible), increment progress
  if (data.isCompleted) {
    await updateBattlePassProgress(1);
  }
  return await prisma.task.create({ data });
};

export const updateTask = async (id: number, data: any) => {
  if (data.isCompleted !== undefined) {
    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (existingTask && existingTask.isCompleted !== data.isCompleted) {
      await updateBattlePassProgress(data.isCompleted ? 1 : -1);
    }
  }
  return await prisma.task.update({ where: { id }, data });
};

export const deleteTask = async (id: number) => {
  return await prisma.task.delete({ where: { id } });
};
