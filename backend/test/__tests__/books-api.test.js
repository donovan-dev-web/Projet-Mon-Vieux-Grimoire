/**
 * booksApi.test.js
 * Tests pour toutes les routes Books avec Jest
 */

// ----- MOCK DE SHARP POUR TOUS LES TESTS -----
jest.mock('../../services/imageServices', () => ({
  saveImage: jest.fn().mockImplementation(async (buffer, filename) => {
    console.log('Mock Sharp saveImage called for', filename);
    return `${filename}.webp`;
  }),
  deleteImage: jest.fn().mockResolvedValue(true),
}));

const request = require('supertest');
const path = require('path');
const app = require('../../app');
const User = require('../../Models/UsersModels');
const Book = require('../../Models/BooksModels');
const argon2 = require('argon2');

const testImagePath = path.join(__dirname, '../__fixtures__/test.jpg');

describe('Books API', () => {
  let token;
  let createdBookId;
  let userId;

  beforeAll(async () => {
    // Création d'un utilisateur pour l'auth
    const passwordHash = await argon2.hash('password123');
    const user = await User.create({
      email: 'user@test.com',
      password: passwordHash,
    });
    userId = user._id.toString();

    // Login pour récupérer le token
    const res = await request(app).post('/api/auth/login').send({
      email: 'user@test.com',
      password: 'password123',
    });
    token = res.body.token;
  });

  beforeEach(async () => {
    // Création d'un livre avant chaque test pour garantir l'indépendance
    const res = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${token}`)
      .field(
        'book',
        JSON.stringify({
          title: 'Mon Livre Test',
          author: 'Auteur Test',
          year: 2023,
          genre: 'Fantastique',
        })
      )
      .attach('image', testImagePath);

    createdBookId = res.body._id;
  });

  afterAll(async () => {
    await Book.deleteMany();
    await User.deleteMany();
  });

  it('should create a book', async () => {
    const res = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${token}`)
      .field(
        'book',
        JSON.stringify({
          title: 'Mon Nouveau Livre',
          author: 'Auteur Nouveau',
          year: 2024,
          genre: 'Science-Fiction',
        })
      )
      .attach('image', testImagePath);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
  });

  it('should get book by id', async () => {
    const res = await request(app).get(`/api/books/${createdBookId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(createdBookId);
  });

  it('should add rating to book', async () => {
    const res = await request(app)
      .post(`/api/books/${createdBookId}/rating`)
      .set('Authorization', `Bearer ${token}`)
      .send({ rating: 4 });

    expect(res.statusCode).toBe(200);
    expect(res.body.averageRating).toBe(4);
  });

  it('should fail if user rates twice', async () => {
    // Premier rating
    await request(app)
      .post(`/api/books/${createdBookId}/rating`)
      .set('Authorization', `Bearer ${token}`)
      .send({ rating: 4 });

    // Deuxième rating = doit échouer
    const res = await request(app)
      .post(`/api/books/${createdBookId}/rating`)
      .set('Authorization', `Bearer ${token}`)
      .send({ rating: 5 });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('code', 'ALREADY_RATED');
  });

  it('should get top rated books', async () => {
    // Ajouter un rating pour avoir au moins un livre dans la liste
    await request(app)
      .post(`/api/books/${createdBookId}/rating`)
      .set('Authorization', `Bearer ${token}`)
      .send({ rating: 5 });

    const res = await request(app).get('/api/books/bestrating');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should delete book', async () => {
    const res = await request(app)
      .delete(`/api/books/${createdBookId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });
});
