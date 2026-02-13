const argon2 = require('argon2');

describe('Argon2 hashing', () => {
  const password = 'superSecret123';
  let hash;

  it('should hash a password', async () => {
    hash = await argon2.hash(password);
    expect(hash).toBeDefined();
    expect(hash).not.toBe(password);
  });

  it('should verify the correct password', async () => {
    const valid = await argon2.verify(hash, password);
    expect(valid).toBe(true);
  });

  it('should reject an incorrect password', async () => {
    const valid = await argon2.verify(hash, 'wrongPassword');
    expect(valid).toBe(false);
  });
});
