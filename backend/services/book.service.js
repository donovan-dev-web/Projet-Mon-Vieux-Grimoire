const Book = require('../models/book.model');
const imageService = require('./image.service');
const AppError = require('../utils/app-error');

/* ===== GET all books ===== */
async function getAllBooks() {
  return await Book.find();
}

/* ===== GET book by ID ===== */
async function getBookById(bookId) {
  const book = await Book.findById(bookId);
  if (!book) {
    throw new AppError('Livre introuvable', 404, 'NOT_FOUND');
  }
  return book;
}

/* ===== CREATE book ===== */
async function createBook(userId, body, file) {
  if (!file) {
    throw new AppError('Image requise', 400, 'IMAGE_REQUIRED');
  }

  // ⚠️ body est déjà validé par validateRequest
  const bookData = { ...body };

  // Sécurité : empêcher injection d'ID
  delete bookData._id;
  delete bookData._userId;

  // Sauvegarde image
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
  if (!book) {
    throw new AppError('Livre introuvable', 404, 'NOT_FOUND');
  }

  if (book.userId.toString() !== userId) {
    throw new AppError('Non autorisé', 403, 'FORBIDDEN');
  }

  let updateData = { ...body };

  if (file) {
    // Supprimer ancienne image
    await imageService.deleteImage(book.imageUrl);

    const filename = await imageService.saveImage(
      file.buffer,
      updateData.title
        ? updateData.title.replace(/\s+/g, '_').toLowerCase()
        : book.title.replace(/\s+/g, '_').toLowerCase()
    );

    updateData.imageUrl = `${process.env.SERVER_URL || 'http://localhost:4000'}/images/${filename}`;
  }

  await Book.updateOne({ _id: bookId }, { ...updateData, _id: bookId });

  return await Book.findById(bookId);
}

/* ===== DELETE book ===== */
async function deleteBook(bookId, userId) {
  const book = await Book.findById(bookId);

  if (!book) {
    throw new AppError('Livre introuvable', 404, 'NOT_FOUND');
  }

  if (book.userId.toString() !== userId) {
    throw new AppError('Non autorisé', 403, 'FORBIDDEN');
  }

  await imageService.deleteImage(book.imageUrl);
  await Book.deleteOne({ _id: bookId });
}

/* ===== ADD rating ===== */
async function addRating(bookId, userId, rating) {
  if (typeof rating !== 'number' || rating < 0 || rating > 5) {
    throw new AppError(
      'La note doit être un nombre entre 0 et 5',
      400,
      'INVALID_RATING'
    );
  }

  const book = await Book.findById(bookId);

  if (!book) {
    throw new AppError('Livre introuvable', 404, 'NOT_FOUND');
  }

  const hasAlreadyRated = book.ratings.some(
    (r) => r.userId.toString() === userId.toString()
  );

  if (hasAlreadyRated) {
    throw new AppError('Vous avez déjà noté ce livre', 400, 'ALREADY_RATED');
  }

  book.ratings.push({ userId, grade: rating });

  // Recalcul moyenne
  const total = book.ratings.reduce((acc, r) => acc + r.grade, 0);
  book.averageRating = total / book.ratings.length;

  await book.save();
  return book;
}

/* ===== GET top rated books ===== */
async function getTopRatedBooks() {
  return await Book.find().sort({ averageRating: -1 }).limit(3);
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
