const Book = require('../Models/BooksModels');
const imageService = require('../services/imageServices');
const { AppError } = require('../utils/errors');

// GET all books
exports.getAllBooks = async (req, res, next) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    next(error);
  }
};

// GET book by ID
exports.getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) return next(new AppError('Livre introuvable', 404, 'NOT_FOUND'));

    res.status(200).json(book);
  } catch (error) {
    next(error);
  }
};

// CREATE book
exports.createBook = async (req, res, next) => {
  try {
    // Vérifier la présence du fichier image
    if (!req.file)
      return next(new AppError('Image requise', 400, 'IMAGE_REQUIRED'));

    // Vérifier le champ book
    if (!req.body.book)
      return next(
        new AppError('Données du livre manquantes', 400, 'BOOK_REQUIRED')
      );

    // Parser le JSON en toute sécurité
    let bookObject;
    if (typeof req.body.book === 'string') {
      try {
        bookObject = JSON.parse(req.body.book);
      } catch (err) {
        return next(
          new AppError('JSON du livre invalide', 400, 'INVALID_JSON')
        );
      }
    } else {
      bookObject = req.body.book;
    }

    // Nettoyage des champs sensibles
    delete bookObject._id;
    delete bookObject._userId;

    // Sauvegarde de l'image
    const filename = await imageService.saveImage(
      req.file.buffer,
      bookObject.title.replace(/\s+/g, '_').toLowerCase()
    );

    // Création du livre
    const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${filename}`,
    });

    await book.save();

    res.status(201).json(book);
  } catch (error) {
    next(error);
  }
};

// UPDATE book
exports.updateBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return next(new AppError('Livre introuvable', 404, 'NOT_FOUND'));
    if (book.userId !== req.auth.userId)
      return next(new AppError('Non autorisé', 403, 'FORBIDDEN'));

    // Vérifier si update avec fichier
    let bookObject;
    if (req.file) {
      try {
        bookObject = JSON.parse(req.body.book);
      } catch (err) {
        return next(
          new AppError('JSON du livre invalide', 400, 'INVALID_JSON')
        );
      }

      // Supprimer l'ancienne image
      await imageService.deleteImage(book.imageUrl);

      const filename = await imageService.saveImage(
        req.file.buffer,
        bookObject.title.replace(/\s+/g, '_').toLowerCase()
      );
      bookObject.imageUrl = `${req.protocol}://${req.get('host')}/images/${filename}`;
    } else {
      bookObject = { ...req.body };
    }

    await Book.updateOne(
      { _id: req.params.id },
      { ...bookObject, _id: req.params.id }
    );

    const updatedBook = await Book.findById(req.params.id);
    res.status(200).json(updatedBook);
  } catch (error) {
    next(error);
  }
};

// DELETE book
exports.deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return next(new AppError('Livre introuvable', 404, 'NOT_FOUND'));
    if (book.userId !== req.auth.userId)
      return next(new AppError('Non autorisé', 403, 'FORBIDDEN'));

    await imageService.deleteImage(book.imageUrl);
    await Book.deleteOne({ _id: req.params.id });

    res.status(200).json({ message: 'Livre supprimé' });
  } catch (error) {
    next(error);
  }
};

// ADD rating
exports.addRating = async (req, res, next) => {
  try {
    const { rating } = req.body;
    const userId = req.auth.userId;
    const bookId = req.params.id;

    /* ===== Validation de la note ===== */
    if (typeof rating !== 'number' || rating < 0 || rating > 5) {
      return next(
        new AppError(
          'La note doit être un nombre entre 0 et 5',
          400,
          'INVALID_RATING'
        )
      );
    }

    /* ===== Récupérer le livre depuis la base de données ===== */
    const book = await Book.findById(bookId);

    if (!book) {
      return next(new AppError('Livre introuvable', 404, 'NOT_FOUND'));
    }

    /* ===== Vérifier si l'utilisateur a déjà noté ce livre ===== */
    const hasAlreadyRated = book.ratings.some(
      (existingRating) => existingRating.userId === userId
    );

    if (hasAlreadyRated) {
      return next(
        new AppError('Vous avez déjà noté ce livre', 400, 'ALREADY_RATED')
      );
    }

    /* ===== Ajouter la nouvelle note ===== */
    const newRating = {
      userId: userId,
      grade: rating,
    };

    book.ratings.push(newRating);

    /* ===== Fonction pour calculer la moyenne des notes ===== */
    function calculateAverageRating(ratings) {
      if (!ratings || ratings.length === 0) {
        return 0;
      }

      let total = 0;

      for (let i = 0; i < ratings.length; i++) {
        total += ratings[i].grade;
      }

      return total / ratings.length;
    }

    // Recalcul de la moyenne
    book.averageRating = calculateAverageRating(book.ratings);

    /* ===== Sauvegarde du livre avec la nouvelle note et la moyenne recalculée ===== */
    await book.save();

    /* ===== Réponse ===== */
    res.status(200).json(book);
  } catch (error) {
    next(error);
  }
};

exports.getTopRatedBooks = async (req, res, next) => {
  try {
    const topRatedBooks = await Book.find()
      .sort({
        averageRating: -1,
        'ratings.length': -1,
      })
      .limit(3);

    res.status(200).json(topRatedBooks);
  } catch (error) {
    next(error);
  }
};
