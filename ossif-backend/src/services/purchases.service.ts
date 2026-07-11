import prisma from '../config/database';

export const getAllPurchases = async () => {
  return await prisma.purchase.findMany({ orderBy: { createdAt: 'desc' } });
};

export const getUnnotifiedTerminatedPurchases = async () => {
  return await prisma.purchase.findMany({ where: { termEmailSent: false } });
};

export const markPurchaseTermEmailSent = async (id: number) => {
  return await prisma.purchase.update({ where: { id }, data: { termEmailSent: true } });
};

export const createPurchase = async (data: any) => {
  return await prisma.purchase.create({ data });
};

export const updatePurchase = async (id: number, data: any) => {
  return await prisma.purchase.update({ where: { id }, data });
};

export const deletePurchase = async (id: number) => {
  return await prisma.purchase.delete({ where: { id } });
};

export const clearPurchases = async () => {
  return await prisma.purchase.deleteMany({});
};
