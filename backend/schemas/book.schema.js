const { z } = require('zod');

const createBookSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  author: z.string().min(1, 'L’auteur est requis'),
  genre: z.string().min(1, 'Le genre est requis'),
  year: z.number().int().min(0, 'Année invalide'),
});

const updateBookSchema = z.object({
  title: z.string().min(1).optional(),
  author: z.string().min(1).optional(),
  genre: z.string().min(1).optional(),
  year: z.number().int().min(0).optional(),
});

module.exports = {
  createBookSchema,
  updateBookSchema,
};
