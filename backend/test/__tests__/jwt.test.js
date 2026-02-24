require('dotenv').config();
const jwt = require('jsonwebtoken');
const jwtConfig = require('../../config/jwt.config');

describe('JWT generation and verification', () => {
  const payload = { userId: '12345' };
  let token;

  it('should generate a valid token', () => {
    token = jwt.sign(payload, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn,
    });
    expect(typeof token).toBe('string');
  });

  it('should verify a valid token', () => {
    const decoded = jwt.verify(token, jwtConfig.secret);
    expect(decoded.userId).toBe(payload.userId);
  });

  it('should throw for invalid token', () => {
    expect(() => jwt.verify('fakeToken', jwtConfig.secret)).toThrow();
  });
});
