const { z } = require('zod');

const signupSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z
    .string()
    .min(6, 'Le mot de passe doit faire au moins 6 caractères'),
});

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Le mot de passe est requis'),
});

module.exports = {
  signupSchema,
  loginSchema,
};
