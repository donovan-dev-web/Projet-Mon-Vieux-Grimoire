const mongoose = require('mongoose');
const mongooseErrorHandler = require('mongoose-error-handler');

describe('mongooseErrorHandler package', () => {
  let TestModel;

  beforeAll(() => {
    const schema = new mongoose.Schema({
      email: { type: String, required: true, unique: true },
    });
    schema.plugin(mongooseErrorHandler);
    TestModel = mongoose.model('TestModel', schema);
  });

  afterEach(async () => {
    await TestModel.deleteMany();
  });

  it('should throw DUPLICATE_FIELD error', async () => {
    await TestModel.create({ email: 'dup@mail.com' });
    try {
      await TestModel.create({ email: 'dup@mail.com' });
    } catch (err) {
      expect(err.status).toBe(400);
      expect(err.code).toBe('DUPLICATE_FIELD');
    }
  });

  it('should throw ValidationError', async () => {
    try {
      await TestModel.create({}); // missing email
    } catch (err) {
      expect(err.status).toBe(400);
    }
  });
});
