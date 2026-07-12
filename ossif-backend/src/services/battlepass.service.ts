import prisma from '../config/database';

export const getActiveBattlePass = async () => {
  return await prisma.battlePass.findFirst({
    where: { isActive: true },
    include: { rewards: true }
  });
};

export const createBattlePass = async (data: { name: string; maxSteps?: number; rewards?: { step: number; description: string }[] }) => {
  // Désactiver les anciens battle pass
  await prisma.battlePass.updateMany({
    data: { isActive: false }
  });

  return await prisma.battlePass.create({
    data: {
      name: data.name,
      isActive: true,
      maxSteps: data.maxSteps || 30,
      rewards: {
        create: data.rewards || []
      }
    },
    include: { rewards: true }
  });
};

import { createNotification } from './inapp-notifications.service';
import { sendEmail } from './notifications.service';

export const updateBattlePassProgress = async (increment: number) => {
  const activeBP = await getActiveBattlePass();
  if (!activeBP) return null;

  const oldProgress = activeBP.progress;
  const newProgress = Math.max(0, Math.min(activeBP.maxSteps, oldProgress + increment));

  // Si on a avancé d'un palier, on vérifie s'il y a une récompense
  if (newProgress > oldProgress) {
    const reward = activeBP.rewards.find((r) => r.step === newProgress);
    if (reward && reward.description.trim() !== '') {
      const title = newProgress === activeBP.maxSteps ? "🏆 Battle Pass Terminé !" : "🎁 Nouvelle Récompense !";
      const message = `Vous avez atteint le palier ${newProgress}. Récompense : ${reward.description}`;
      
      // Création de la notification In-App
      await createNotification(title, message).catch(console.error);

      // Envoi de l'email
      sendEmail(
        '', 
        title,
        message,
        `<div style="font-family: sans-serif; text-align: center;"><h1>${title}</h1><p style="font-size: 16px;">${message}</p></div>`
      ).catch(console.error);
    }
  }

  return await prisma.battlePass.update({
    where: { id: activeBP.id },
    data: { progress: newProgress },
    include: { rewards: true }
  });
};
