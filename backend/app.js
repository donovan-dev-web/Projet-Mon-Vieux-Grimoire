/* Import .env variables */
require('dotenv').config();

/* ===== Importation de Swagger ===== */
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

/* ===== Importation des modules ===== */
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

/* ===== Importation du middleware de gestion des erreurs ===== */
const errorHandler = require('./Middleware/errorHandler');

/* ===== Importation des routes ===== */
const userRoutes = require('./routes/UsersRoutes');

const app = express();

/* ===== Connexion à MongoDB ===== */
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

/* ===== CORS Fix ===== */
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  next();
});

/* ===== parser JSON ===== */
app.use(bodyParser.json());

/* ===== Documentation Swagger ===== */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* ===== Routes ===== */
app.use('/api/auth', userRoutes);

/* ===== Middleware de gestion des erreurs ===== */
app.use(errorHandler);

module.exports = app;
