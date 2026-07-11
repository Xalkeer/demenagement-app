import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import cron from 'node-cron';
import nodemailer from 'nodemailer';
import swaggerUi from 'swagger-ui-express';
import 'dotenv/config';

const app = express();
const prisma = new PrismaClient();
const port = process.env.BACKEND_PORT || 4000;

// Configuration
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

// -- UTILITAIRES --
export const calculateRemaining = (purchase: any) => {
  const monthlyPayment = purchase.price / purchase.monthsToPay;
  if (!purchase.reimbursementStartDate) {
    return { remaining: purchase.price, monthlyPayment, monthsRemaining: purchase.monthsToPay };
  }
  const startDate = new Date(purchase.reimbursementStartDate);
  const currentDate = new Date();
  const monthDiff = (currentDate.getFullYear() - startDate.getFullYear()) * 12 + (currentDate.getMonth() - startDate.getMonth());
  const monthsPassedRaw = Math.max(0, monthDiff);
  const skipped = purchase.skippedMonths || 0;
  const monthsPassed = Math.max(0, monthsPassedRaw - skipped);
  
  if (monthsPassed >= purchase.monthsToPay) return { remaining: 0, monthlyPayment, monthsRemaining: 0 };
  const amountPaid = monthsPassed * monthlyPayment;
  return { remaining: purchase.price - amountPaid, monthlyPayment, monthsRemaining: purchase.monthsToPay - monthsPassed };
};

// -- TÂCHE CRON --
async function checkPurchases() {
  console.log(`[CRON] Vérification des achats...`);
  try {
    const purchases = await prisma.purchase.findMany({ where: { termEmailSent: false } });
    for (const purchase of purchases) {
      const { monthsRemaining } = calculateRemaining(purchase);
      if (monthsRemaining <= 0) {
        console.log(`[CRON] Achat terminé détecté : ${purchase.name}`);
        const mailOptions = {
          from: `"Achats App" <${process.env.SMTP_EMAIL}>`,
          to: process.env.SMTP_TO_EMAILS || process.env.SMTP_EMAIL,
          subject: `🎉 Achat terminé : ${purchase.name}`,
          text: `Bonne nouvelle !\n\nL'achat "${purchase.name}" est arrivé à son terme de paiement.`,
        };
        await transporter.sendMail(mailOptions);
        await prisma.purchase.update({ where: { id: purchase.id }, data: { termEmailSent: true } });
      }
    }
  } catch (err) {
    console.error(`[CRON] Erreur :`, err);
  }
}

cron.schedule("0 8 * * *", () => checkPurchases());

// -- SWAGGER DOCS --
const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Achats API",
    version: "1.0.0",
    description: "API de gestion des achats et listes de tâches",
  },
  servers: [
    { url: "/api", description: "API Locale" },
  ],
  paths: {
    "/purchases": {
      get: { summary: "Liste des achats", responses: { "200": { description: "Succès" } } },
      post: { summary: "Créer un achat", responses: { "200": { description: "Succès" } } }
    },
    "/purchases/{id}": {
      put: { summary: "Modifier un achat", parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }], responses: { "200": { description: "Succès" } } },
      delete: { summary: "Supprimer un achat", parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }], responses: { "200": { description: "Succès" } } }
    },
    "/lists": {
      get: { summary: "Liste des listes de tâches", responses: { "200": { description: "Succès" } } },
      post: { summary: "Créer une liste", responses: { "200": { description: "Succès" } } }
    },
    "/lists/{id}": {
      delete: { summary: "Supprimer une liste", parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }], responses: { "200": { description: "Succès" } } }
    },
    "/tasks": {
      get: { summary: "Liste de toutes les tâches", responses: { "200": { description: "Succès" } } },
      post: { summary: "Créer une tâche", responses: { "200": { description: "Succès" } } }
    },
    "/tasks/{id}": {
      put: { summary: "Modifier une tâche", parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }], responses: { "200": { description: "Succès" } } },
      delete: { summary: "Supprimer une tâche", parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }], responses: { "200": { description: "Succès" } } }
    },
    "/notifications/email": {
      post: { summary: "Envoyer un email manuel", responses: { "200": { description: "Succès" } } }
    },
    "/import": {
      post: { summary: "Importer des achats via JSON", responses: { "200": { description: "Succès" } } }
    }
  }
};
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// -- ROUTES API --

// Lists
app.get('/api/lists', async (req, res) => {
  const lists = await prisma.list.findMany({ include: { tasks: true } });
  res.json(lists);
});
app.post('/api/lists', async (req, res) => {
  const list = await prisma.list.create({ data: req.body });
  res.json(list);
});
app.delete('/api/lists/:id', async (req, res) => {
  await prisma.list.delete({ where: { id: Number(req.params.id) } });
  res.json({ success: true });
});

// Tasks
app.get('/api/tasks', async (req, res) => {
  const tasks = await prisma.task.findMany({ include: { list: true } });
  res.json(tasks);
});
app.post('/api/tasks', async (req, res) => {
  const { title, completed, listId, priority, date, description, location, assignee } = req.body;
  const task = await prisma.task.create({ data: { title, completed, listId, priority, date, description, location, assignee } });
  res.json(task);
});
app.put('/api/tasks/:id', async (req, res) => {
  const { title, completed, listId, priority, date, description, location, assignee } = req.body;
  // If req.body is passed directly, Prisma will update fields that are present.
  // It's safer to use req.body or explicitly extract them. Here we just use req.body as it was.
  const task = await prisma.task.update({ where: { id: Number(req.params.id) }, data: req.body });
  res.json(task);
});
app.delete('/api/tasks/:id', async (req, res) => {
  await prisma.task.delete({ where: { id: Number(req.params.id) } });
  res.json({ success: true });
});

// Purchases
app.get('/api/purchases', async (req, res) => {
  const purchases = await prisma.purchase.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(purchases);
});
app.post('/api/purchases', async (req, res) => {
  const data = { ...req.body, monthsToPay: parseInt(req.body.monthsToPay, 10), price: parseFloat(req.body.price) };
  if (data.date) data.date = new Date(data.date);
  if (data.expectedReceptionDate) data.expectedReceptionDate = new Date(data.expectedReceptionDate);
  if (data.reimbursementStartDate) data.reimbursementStartDate = new Date(data.reimbursementStartDate);
  const purchase = await prisma.purchase.create({ data });
  res.json(purchase);
});
app.put('/api/purchases/:id', async (req, res) => {
  const data = { ...req.body };
  if (data.monthsToPay) data.monthsToPay = parseInt(data.monthsToPay, 10);
  if (data.price) data.price = parseFloat(data.price);
  if (data.date) data.date = new Date(data.date);
  if (data.expectedReceptionDate) data.expectedReceptionDate = new Date(data.expectedReceptionDate);
  if (data.reimbursementStartDate) data.reimbursementStartDate = new Date(data.reimbursementStartDate);
  const purchase = await prisma.purchase.update({ where: { id: Number(req.params.id) }, data });
  res.json(purchase);
});
app.delete('/api/purchases/:id', async (req, res) => {
  await prisma.purchase.delete({ where: { id: Number(req.params.id) } });
  res.json({ success: true });
});

// Notifications Test
app.post('/api/notifications/email', async (req, res) => {
  const { subject, text, html, to } = req.body;
  const mailOptions = {
    from: `"Achats App" <${process.env.SMTP_EMAIL}>`,
    to: to || process.env.SMTP_TO_EMAILS || process.env.SMTP_EMAIL,
    subject: subject || 'Notification de votre application Achats',
    text: text || 'Ceci est un test de notification.',
    html: html || undefined,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    res.json({ success: true, messageId: info.messageId });
  } catch (error: any) {
    res.status(500).json({ error: 'Erreur lors de l\'envoi de l\'email', details: error.message });
  }
});

// Import
app.post('/api/import', async (req, res) => {
  const data = req.body;
  if (!Array.isArray(data)) return res.status(400).json({ error: 'Invalid data format' });
  try {
    // Basic import logic
    await prisma.purchase.deleteMany({});
    for (const item of data) {
      await prisma.purchase.create({
        data: {
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
        }
      });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Import failed' });
  }
});

// Start
app.listen(port, () => {
  console.log(`🚀 Backend démarré sur http://localhost:${port}`);
});
