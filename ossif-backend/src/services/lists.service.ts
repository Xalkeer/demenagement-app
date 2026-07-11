import prisma from '../config/database';

export const getAllLists = async () => {
  return await prisma.list.findMany({ include: { tasks: true } });
};

export const createList = async (data: any) => {
  return await prisma.list.create({ data });
};

export const deleteList = async (id: number) => {
  return await prisma.list.delete({ where: { id } });
};
