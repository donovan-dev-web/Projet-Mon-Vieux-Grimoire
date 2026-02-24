const bookService = require('../services/book.service');
const { AppError } = require('../utils/app-error');

// GET all books
exports.getAllBooks = async (req, res, next) => {
  try {
    const books = await bookService.getAllBooks();
    res.status(200).json(books);
  } catch (error) {
    next(error);
  }
};

// GET book by ID
exports.getBookById = async (req, res, next) => {
  try {
    const book = await bookService.getBookById(req.params.id);
    res.status(200).json(book);
  } catch (error) {
    next(error);
  }
};

// CREATE book
exports.createBook = async (req, res, next) => {
  try {
    const book = await bookService.createBook(
      req.auth.userId,
      req.body,
      req.file
    );
    res.status(201).json(book);
  } catch (error) {
    next(error);
  }
};

// UPDATE book
exports.updateBook = async (req, res, next) => {
  try {
    const book = await bookService.updateBook(
      req.params.id,
      req.auth.userId,
      req.body,
      req.file
    );
    res.status(200).json(book);
  } catch (error) {
    next(error);
  }
};

// DELETE book
exports.deleteBook = async (req, res, next) => {
  try {
    await bookService.deleteBook(req.params.id, req.auth.userId);
    res.status(200).json({ message: 'Livre supprimé' });
  } catch (error) {
    next(error);
  }
};

// ADD rating
exports.addRating = async (req, res, next) => {
  try {
    const book = await bookService.addRating(
      req.params.id,
      req.auth.userId,
      req.body.rating
    );
    res.status(200).json(book);
  } catch (error) {
    next(error);
  }
};

// GET top rated books
exports.getTopRatedBooks = async (req, res, next) => {
  try {
    const books = await bookService.getTopRatedBooks();
    res.status(200).json(books);
  } catch (error) {
    next(error);
  }
};
