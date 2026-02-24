const Book = require('../models/book.model');
const imageService = require('./image.service');
const { AppError } = require('../utils/app-error');

/* ===== GET all books ===== */
async function getAllBooks() {
  return await Book.find();
}

/* ===== GET book by ID ===== */
async function getBookById(bookId) {
  const book = await Book.findById(bookId);
  if (!book) throw new AppError('Livre introuvable', 404, 'NOT_FOUND');
  return book;
}

/* ===== CREATE book ===== */
async function createBook(userId, body, file) {
  if (!file) throw new AppError('Image requise', 400, 'IMAGE_REQUIRED');
  if (!body.book)
    throw new AppError('Données du livre manquantes', 400, 'BOOK_REQUIRED');

  let bookData;
  if (typeof body.book === 'string') {
    try {
      bookData = JSON.parse(body.book);
    } catch {
      throw new AppError('JSON du livre invalide', 400, 'INVALID_JSON');
    }
  } else {
    bookData = body.book;
  }

  // Nettoyage des champs sensibles
  delete bookData._id;
  delete bookData._userId;

  // Sauvegarde de l'image
  const filename = await imageService.saveImage(
    file.buffer,
    bookData.title.replace(/\s+/g, '_').toLowerCase()
  );

  const newBook = new Book({
    ...bookData,
    userId,
    imageUrl: `${process.env.SERVER_URL || 'http://localhost:4000'}/images/${filename}`,
  });

  await newBook.save();
  return newBook;
}

/* ===== UPDATE book ===== */
async function updateBook(bookId, userId, body, file) {
  const book = await Book.findById(bookId);
  if (!book) throw new AppError('Livre introuvable', 404, 'NOT_FOUND');
  if (book.userId !== userId)
    throw new AppError('Non autorisé', 403, 'FORBIDDEN');

  let bookData;
  if (file) {
    try {
      bookData = JSON.parse(body.book);
    } catch {
      throw new AppError('JSON du livre invalide', 400, 'INVALID_JSON');
    }

    // Supprimer l'ancienne image
    await imageService.deleteImage(book.imageUrl);

    const filename = await imageService.saveImage(
      file.buffer,
      bookData.title.replace(/\s+/g, '_').toLowerCase()
    );
    bookData.imageUrl = `${process.env.SERVER_URL || 'http://localhost:4000'}/images/${filename}`;
  } else {
    bookData = { ...body };
  }

  await Book.updateOne({ _id: bookId }, { ...bookData, _id: bookId });
  const updatedBook = await Book.findById(bookId);
  return updatedBook;
}

/* ===== DELETE book ===== */
async function deleteBook(bookId, userId) {
  const book = await Book.findById(bookId);
  if (!book) throw new AppError('Livre introuvable', 404, 'NOT_FOUND');
  if (book.userId !== userId)
    throw new AppError('Non autorisé', 403, 'FORBIDDEN');

  await imageService.deleteImage(book.imageUrl);
  await Book.deleteOne({ _id: bookId });
}

/* ===== ADD rating ===== */
async function addRating(bookId, userId, rating) {
  if (typeof rating !== 'number' || rating < 0 || rating > 5)
    throw new AppError(
      'La note doit être un nombre entre 0 et 5',
      400,
      'INVALID_RATING'
    );

  const book = await Book.findById(bookId);
  if (!book) throw new AppError('Livre introuvable', 404, 'NOT_FOUND');

  const hasAlreadyRated = book.ratings.some((r) => r.userId === userId);
  if (hasAlreadyRated)
    throw new AppError('Vous avez déjà noté ce livre', 400, 'ALREADY_RATED');

  book.ratings.push({ userId, grade: rating });

  // Recalculer la moyenne
  const total = book.ratings.reduce((acc, r) => acc + r.grade, 0);
  book.averageRating = total / book.ratings.length;

  await book.save();
  return book;
}

/* ===== GET top rated books ===== */
async function getTopRatedBooks() {
  return await Book.find()
    .sort({ averageRating: -1, 'ratings.length': -1 })
    .limit(3);
}

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  addRating,
  getTopRatedBooks,
};
