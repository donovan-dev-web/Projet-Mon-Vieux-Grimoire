// swagger.config.js
const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Mon Vieux Grimoire',
      version: '1.0.0',
      description: 'Documentation API pour le projet Mon Vieux Grimoire',
    },
    servers: [
      {
        url: 'http://localhost:4000/api',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        // ======= Book =======
        Book: {
          type: 'object',
          required: [
            'userId',
            'title',
            'author',
            'imageUrl',
            'year',
            'genre',
            'ratings',
            'averageRating',
          ],
          properties: {
            _id: {
              type: 'string',
              description: 'ID unique du livre',
              example: '60c72b2f9b1d8e5a5c8f9e7a',
            },
            userId: {
              type: 'string',
              description: "ID de l'utilisateur propriétaire",
              example: '60c72b2f9b1d8e5a5c8f9e7a',
            },
            title: {
              type: 'string',
              description: 'Titre du livre',
              example: 'Mon livre',
            },
            author: {
              type: 'string',
              description: 'Auteur du livre',
              example: 'Auteur',
            },
            imageUrl: {
              type: 'string',
              description: "URL de l'image du livre",
              example: 'http://localhost:4000/images/mon-livre.jpg',
            },
            year: {
              type: 'integer',
              description: 'Année de publication du livre',
              example: 2021,
            },
            genre: {
              type: 'string',
              description: 'Genre du livre',
              example: 'Fantastique',
            },
            ratings: {
              type: 'array',
              description: 'Notes des utilisateurs',
              items: {
                type: 'object',
                properties: {
                  userId: {
                    type: 'string',
                    description: "ID de l'utilisateur qui a noté le livre",
                    example: '60c72b2f9b1d8e5a5c8f9e7a',
                  },
                  grade: {
                    type: 'number',
                    description: "Note donnée par l'utilisateur",
                    example: 4,
                  },
                },
              },
            },
            averageRating: {
              type: 'number',
              description: 'Note moyenne du livre',
              example: 4.5,
            },
          },
        },

        BookCreate: {
          type: 'object',
          required: ['title', 'author', 'genre', 'year'],
          properties: {
            title: { type: 'string', example: 'Mon livre' },
            author: { type: 'string', example: 'Auteur' },
            genre: { type: 'string', example: 'Fantastique' },
            year: { type: 'integer', example: 2021 },
          },
        },

        BookUpdate: {
          type: 'object',
          properties: {
            title: { type: 'string', example: 'Nouveau titre' },
            author: { type: 'string', example: 'Nouvel auteur' },
            genre: { type: 'string', example: 'Nouvel genre' },
            year: { type: 'integer', example: 2022 },
          },
        },

        // ======= User =======
        User: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            _id: {
              type: 'string',
              description: "ID unique de l'utilisateur",
              example: '60c72b2f9b1d8e5a5c8f9e7a',
            },
            email: {
              type: 'string',
              description: "Adresse e-mail de l'utilisateur",
              example: 'utilisateur@example.com',
            },
            password: {
              type: 'string',
              description: "Mot de passe de l'utilisateur",
              example: 'motdepasse123',
            },
          },
        },

        UserSignup: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'test@example.com',
            },
            password: { type: 'string', example: 'MotDePasse123!' },
          },
        },

        UserLogin: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'test@example.com',
            },
            password: { type: 'string', example: 'MotDePasse123!' },
          },
        },
      },
    },
  },
  apis: [path.join(__dirname, '../routes/*.js')],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
