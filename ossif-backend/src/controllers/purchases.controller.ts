import { Request, Response } from 'express';
import fs from 'fs';
import * as purchasesService from '../services/purchases.service';
import { sendEmail } from '../services/notifications.service';
import { calculateRemaining } from '../utils/calculations';

const checkAndSendEmail = async (purchase: any) => {
  const logMsg = (msg: string) => {
    console.log(msg);
    fs.appendFileSync('email-debug.log', `${new Date().toISOString()} - ${msg}\n`);
  };

  logMsg(`\n[EMAIL DEBUG] Début de la vérification pour l'achat "${purchase.name}"`);
  
  if (purchase.termEmailSent) {
    logMsg(`[EMAIL DEBUG] ❌ Le mail a déjà été envoyé pour cet achat (termEmailSent=true).`);
    return purchase;
  }
  
  const { monthsRemaining } = calculateRemaining(purchase);
  logMsg(`[EMAIL DEBUG] Mois restants calculés : ${monthsRemaining}`);
  
  if (monthsRemaining <= 0) {
    logMsg(`[EMAIL DEBUG] ✅ L'achat est terminé (monthsRemaining <= 0). Tentative d'envoi du mail...`);
    const emailTo = process.env.SMTP_TO_EMAILS || process.env.SMTP_EMAIL || '';
    logMsg(`[EMAIL DEBUG] Destinataire(s) du mail : ${emailTo}`);
    
    try {
      await sendEmail(
        emailTo,
        `🎉 Achat terminé : ${purchase.name}`,
        `Bonne nouvelle !\n\nL'achat "${purchase.name}" est arrivé à son terme de paiement.`
      );
      logMsg(`[EMAIL DEBUG] ✅ Mail envoyé avec succès ! Mise à jour de termEmailSent en base...`);
      return await purchasesService.markPurchaseTermEmailSent(purchase.id);
    } catch (err) {
      logMsg(`[EMAIL DEBUG] 🚨 ERREUR CRITIQUE lors de l'envoi de l'email pour "${purchase.name}": ${err}`);
    }
  } else {
    logMsg(`[EMAIL DEBUG] ❌ L'achat n'est pas encore terminé (il reste ${monthsRemaining} mois).`);
  }
  
  logMsg(`[EMAIL DEBUG] Fin de la vérification.\n`);
  return purchase;
};

export const getAllPurchases = async (req: Request, res: Response) => {
  try {
    const purchases = await purchasesService.getAllPurchases();
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch purchases' });
  }
};

export const createPurchase = async (req: Request, res: Response) => {
  try {
    const data = { ...req.body, monthsToPay: parseInt(req.body.monthsToPay, 10), price: parseFloat(req.body.price) };
    if (data.date) data.date = new Date(data.date);
    if (data.expectedReceptionDate) data.expectedReceptionDate = new Date(data.expectedReceptionDate);
    if (data.reimbursementStartDate) data.reimbursementStartDate = new Date(data.reimbursementStartDate);
    
    let purchase = await purchasesService.createPurchase(data);
    purchase = await checkAndSendEmail(purchase);
    res.json(purchase);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create purchase' });
  }
};

export const updatePurchase = async (req: Request, res: Response) => {
  try {
    const data = { ...req.body };
    if (data.monthsToPay) data.monthsToPay = parseInt(data.monthsToPay, 10);
    if (data.price) data.price = parseFloat(data.price);
    if (data.date) data.date = new Date(data.date);
    if (data.expectedReceptionDate) data.expectedReceptionDate = new Date(data.expectedReceptionDate);
    if (data.reimbursementStartDate) data.reimbursementStartDate = new Date(data.reimbursementStartDate);
    
    let purchase = await purchasesService.updatePurchase(Number(req.params.id), data);
    purchase = await checkAndSendEmail(purchase);
    res.json(purchase);
  } catch (error) {
    console.error("Error in updatePurchase:", error);
    res.status(500).json({ error: 'Failed to update purchase' });
  }
};

export const deletePurchase = async (req: Request, res: Response) => {
  try {
    await purchasesService.deletePurchase(Number(req.params.id));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete purchase' });
  }
};

export const importPurchases = async (req: Request, res: Response) => {
  const data = req.body;
  if (!Array.isArray(data)) return res.status(400).json({ error: 'Invalid data format' });
  try {
    await purchasesService.clearPurchases();
    for (const item of data) {
      await purchasesService.createPurchase({
        name: item.name,
        price: item.price,
        date: new Date(item.date),
        monthsToPay: item.monthsToPay,
        category: item.category,
        lastPaidMonth: item.lastPaidMonth,
        link: item.link,
        expectedReceptionDate: item.expectedReceptionDate ? new Date(item.expectedReceptionDate) : null,
        reimbursementStartDate: item.reimbursementStartDate ? new Date(item.reimbursementStartDate) : null,
        skippedMonths: item.skippedMonths || 0,
      });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Import failed' });
  }
};
