const request = require('supertest');
const app = require('../../app');
const User = require('../../Models/UsersModels');
const argon2 = require('argon2');

describe('POST /signup', () => {
  it('should create a user', async () => {
    const response = await request(app).post('/api/auth/signup').send({
      email: 'test@mail.com',
      password: '123456',
    });

    expect(response.statusCode).toBe(201);

    const user = await User.findOne({ email: 'test@mail.com' });
    expect(user).not.toBeNull();
  });

  it('should fail if email already exists', async () => {
    await User.create({
      email: 'duplicate@mail.com',
      password: await argon2.hash('123456'),
    });

    const response = await request(app).post('/api/auth/signup').send({
      email: 'duplicate@mail.com',
      password: '123456',
    });

    expect(response.statusCode).toBe(400);
  });
});

describe('POST /login', () => {
  beforeAll(async () => {
    // S'assurer qu'un utilisateur existe pour tester le login
    await User.create({
      email: 'login@mail.com',
      password: await argon2.hash('password123'),
    });
  });

  it('should login successfully with correct credentials', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: 'login@mail.com',
      password: 'password123',
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('userId');
    expect(response.body).toHaveProperty('token');
    expect(typeof response.body.token).toBe('string');
  });

  it('should fail with non-existing email', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: 'notfound@mail.com',
      password: 'password123',
    });

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('code', 'INVALID_CREDENTIALS');
  });

  it('should fail with wrong password', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: 'login@mail.com',
      password: 'wrongpassword',
    });

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('code', 'INVALID_CREDENTIALS');
  });
});
