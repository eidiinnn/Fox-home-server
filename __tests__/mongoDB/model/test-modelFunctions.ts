import MongoDB from '../../../src/database/mongoDB';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

const collection = 'modelfunctionTests'

beforeAll(() => {
  const db = new MongoDB(process.env.MONGODB_URI as string);
  db.connect();
});
afterAll(() => {
  mongoose.connection.db.dropCollection(collection);
});

test('model save works', async () => {
  const model = MongoDB.createModel('SaveTest', { name: 'string' }, collection);
  const ToSave = new model({ name: 'eduardo' });

  return ToSave.save().then((err: object) => expect(!err).toBe(false));
});

test('model find works', async () => {
  const model = MongoDB.createModel('FindTest', { name: 'string' }, collection);
  const toSave = new model({ name: 'Lucas' });
  const saved = await toSave.save();

  const findResult = await model.findOne({ _id: saved._id }).exec();
  return expect(findResult._id).toStrictEqual(saved._id);
});

test('model update works', async () => {
  const model = MongoDB.createModel('UpdateTest', { name: 'string' }, collection);
  const toSave = new model({ name: 'Cleber' });
  const saved = await toSave.save();

  await model.findOneAndUpdate({ _id: saved._id }, { name: 'Paulo' },).exec();
  const findToVerify = await model.findOne({ _id: saved._id }).exec();

  return expect(findToVerify.name).toEqual('Paulo');
});

test('model delete works', async () => {
  const model = MongoDB.createModel('DeleteTest', { name: 'string' }, collection);
  const toSave = new model({ name: 'José' });
  const saved = await toSave.save();

  await model.findOneAndDelete({ _id: saved._id }).exec();
  const findToVerify = await model.findOne({ _id: saved._id }).exec();

  return expect(findToVerify).toEqual(null);
});
