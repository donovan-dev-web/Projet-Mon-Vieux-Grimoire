const express = require('express');
const router = express.Router();

// Controllers
const usersController = require('../controllers/user.controller');

// Middleware de validation
const validateRequest = require('../middlewares/validate-request.middleware');

// Zod schemas
const { signupSchema, loginSchema } = require('../schemas/user.schema');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Gestion des utilisateurs (inscription / connexion)
 */

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Créer un nouvel utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: test@example.com
 *               password:
 *                 type: string
 *                 example: MotDePasse123!
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Utilisateur créé avec succès
 *       400:
 *         description: Erreur côté client (données invalides ou identifiant déjà utilisé)
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     status:
 *                       type: integer
 *                       example: 400
 *                     code:
 *                       type: string
 *                       example: INVALID_INPUT
 *                     message:
 *                       type: string
 *                       example: Données envoyées invalides
 *                 - type: object
 *                   properties:
 *                     status:
 *                       type: integer
 *                       example: 400
 *                     code:
 *                       type: string
 *                       example: INVALID_CREDENTIALS
 *                     message:
 *                       type: string
 *                       example: Identifiant ou mot de passe incorrect
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 code:
 *                   type: string
 *                   example: SERVER_ERROR
 *                 message:
 *                   type: string
 *                   example: Une erreur inattendue est survenue
 */
router.post('/signup', validateRequest(signupSchema), usersController.signup);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Connecter un utilisateur existant
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: test@example.com
 *               password:
 *                 type: string
 *                 example: MotDePasse123!
 *     responses:
 *       200:
 *         description: Connexion réussie, retourne le token JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   example: 63f5e7c7a1f3b6a1e4d2c8b1
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Identifiants incorrects
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 code:
 *                   type: string
 *                   example: INVALID_CREDENTIALS
 *                 message:
 *                   type: string
 *                   example: Identifiants ou mot de passe incorrect
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 code:
 *                   type: string
 *                   example: SERVER_ERROR
 *                 message:
 *                   type: string
 *                   example: Une erreur inattendue est survenue
 */
router.post('/login', validateRequest(loginSchema), usersController.login);

module.exports = router;
