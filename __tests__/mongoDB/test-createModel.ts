import MongoDB from '../../src/database/mongoDB';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

beforeEach(() => {
  mongoose.connection.close();
});

test('model as created with same name', () => {
  const model = MongoDB.createModel('testSameName', { test: 'string' });
  expect(model.modelName).toBe('testSameName');
});

test('model sent a error if exist a wrong type in the schema', () => {
  try {
    MongoDB.createModel('testWrongType', { test: 'notAType' });
  } catch (err) {
    const errorToCompare = Error(
      'Invalid schema configuration: `NotAType` is not a valid type at path `test`. See https://bit.ly/mongoose-schematypes for a list of valid schema types.'
    );
    errorToCompare.name = 'TypeError';

    expect(err).toEqual(errorToCompare);
  }
});

test('model save works', async () => {
  const db = new MongoDB(process.env.MONGODB_URI as string);
  await db.connect();

  const model = MongoDB.createModel('SaveTest', { name: 'string' });
  const ToSave = new model({ name: 'eduardo' });

  return ToSave.save().then((err: object) => expect(!err).toBe(false));
});

test('model find works', async () => {
  const db = new MongoDB(process.env.MONGODB_URI as string);
  await db.connect();

  const model = MongoDB.createModel('FindTest', { name: 'string' });
  const toSave = new model({ name: 'Lucas' });
  const saved = await toSave.save();

  const findResult = await model.findOne({ _id: saved._id }).exec();
  return expect(findResult._id).toStrictEqual(saved._id);
});
