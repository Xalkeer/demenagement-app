import prisma from '../config/database';

export const getAllTasks = async () => {
  return await prisma.task.findMany({ include: { list: true } });
};

export const createTask = async (data: any) => {
  return await prisma.task.create({ data });
};

export const updateTask = async (id: number, data: any) => {
  return await prisma.task.update({ where: { id }, data });
};

export const deleteTask = async (id: number) => {
  return await prisma.task.delete({ where: { id } });
};
