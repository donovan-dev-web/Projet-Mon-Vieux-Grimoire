const express = require('express');
const router = express.Router();
// Import Midlleware
const auth = require('../middlewares/auth.middleware');
const multer = require('../middlewares/multer-config.middleware');
// Import Controllers
const bookCtrl = require('../controllers/book.controller');
// Import Schema validation
const validateRequest = require('../middlewares/validate-request.middleware');
const {
  createBookSchema,
  updateBookSchema,
} = require('../schemas/book.schema');

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Gestion des livres
 */

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Récupérer tous les livres
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: Liste des livres
 */
router.get('/', bookCtrl.getAllBooks);

/**
 * @swagger
 * /books/bestrating:
 *   get:
 *     summary: Récupérer les 3 livres les mieux notés
 *     description: Retourne un tableau contenant les trois livres ayant la meilleure note moyenne.
 *     tags:
 *       - Books
 *     responses:
 *       200:
 *         description: Liste des 3 livres les mieux notés
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       500:
 *         description: Erreur serveur
 */
router.get('/bestrating', bookCtrl.getTopRatedBooks);

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Récupérer un livre par ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du livre
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Livre trouvé
 *       404:
 *         description: Livre introuvable
 */
router.get('/:id', bookCtrl.getBookById);

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Créer un nouveau livre
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - book
 *               - image
 *             properties:
 *               book:
 *                 type: string
 *                 description: JSON stringifié du livre
 *                 example: '{"title":"Mon livre","author":"Auteur","description":"..."}'
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image du livre
 *     responses:
 *       201:
 *         description: Livre créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         description: Données invalides ou image manquante
 *       401:
 *         description: Non authentifié
 */
router.post(
  '/',
  auth,
  multer,
  validateRequest(createBookSchema),
  bookCtrl.createBook
);

/**
 * @swagger
 * /books/{id}:
 *   put:
 *     summary: Modifier un livre
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               book:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Livre modifié
 *       403:
 *         description: Non autorisé
 */
router.put(
  '/:id',
  auth,
  multer,
  validateRequest(updateBookSchema),
  bookCtrl.updateBook
);

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Supprimer un livre
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Livre supprimé
 *       403:
 *         description: Non autorisé
 */
router.delete('/:id', auth, bookCtrl.deleteBook);

/**
 * @swagger
 * /books/{id}/rating:
 *   post:
 *     summary: Ajouter une note à un livre
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 example: 4
 *     responses:
 *       200:
 *         description: Note ajoutée
 *       400:
 *         description: Déjà noté ou note invalide
 */
router.post('/:id/rating', auth, bookCtrl.addRating);

module.exports = router;
