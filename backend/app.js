/* Import .env variables */
require('dotenv').config();

/* ===== Importation de Swagger ===== */
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

/* ===== Importation des modules ===== */
const express = require('express');
const path = require('path');
const fs = require('fs');

/* ===== Importation du middleware de gestion des erreurs ===== */
const errorHandler = require('./Middleware/errorHandler');

/* ===== Importation des routes ===== */
const userRoutes = require('./Routes/UsersRoutes');
const bookRoutes = require('./Routes/BooksRoutes');

const app = express();

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

/* ===== Middleware pour parser le JSON ===== */
app.use(express.json({ limit: '10mb' }));
/* ===== Documentation Swagger ===== */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* ===== Routes ===== */
app.use('/api/auth', userRoutes);
app.use('/api/books', bookRoutes);

/* ===== Route pour service de fichier statique ===== */
if (!fs.existsSync('images')) {
  fs.mkdirSync('images');
}
app.use('/images', express.static(path.join(__dirname, 'images')));

/* ===== Middleware de gestion des erreurs ===== */
app.use(errorHandler);

module.exports = app;
