import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import 'dotenv/config';
import apiRoutes from './routes';

const app = express();
const port = process.env.BACKEND_PORT || 4000;

// Configuration
app.use(cors());
app.use(express.json());

// Log middleware
app.use((req, res, next) => {
  console.log(`\n=> [API] ${req.method} ${req.originalUrl}`);
  next();
});

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
app.use('/api', apiRoutes);
// Start
app.listen(port, () => {
  console.log(`🚀 Backend démarré sur http://localhost:${port}`);
});
