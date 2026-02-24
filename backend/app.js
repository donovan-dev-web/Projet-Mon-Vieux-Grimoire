require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

/* ===== Import Doc ===== */
//const swaggerUi = require('swagger-ui-express');
//const swaggerSpec = require('./config/swagger.config');

/* ===== Import Routes + Handler ===== */
const errorHandler = require('./middlewares/error-handler.middleware');
const userRoutes = require('./routes/user.route');
const bookRoutes = require('./routes/book.route');

const app = express();

/* ===== Middlewares global ===== */
app.use(cors());
app.use(express.json({ limit: '10mb' }));

/* ===== Swagger documentations ===== */
//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* ===== Routes ===== */
app.use('/api/auth', userRoutes);
app.use('/api/books', bookRoutes);

/* ===== Fichiers statiques ===== */
app.use('/images', express.static(path.join(__dirname, 'images')));

/* ===== Handler pour les erreurs ===== */
app.use(errorHandler);

module.exports = app;
