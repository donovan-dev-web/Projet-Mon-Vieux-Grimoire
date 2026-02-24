const request = require('supertest');
const express = require('express');
const errorHandler = require('../../middlewares/error-handler.middleware');

describe('Global error handler', () => {
  const app = express();
  app.get('/operational-error', (req, res, next) => {
    const err = new Error('Operational error');
    err.status = 400;
    err.isOperational = true;
    next(err);
  });

  app.get('/unexpected-error', (req, res, next) => {
    throw new Error('Unexpected!');
  });

  app.use(errorHandler);

  it('should handle operational error', async () => {
    const res = await request(app).get('/operational-error');
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Operational error');
  });

  it('should handle unexpected error', async () => {
    const res = await request(app).get('/unexpected-error');
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe('Une erreur inattendue est survenue');
  });
});
