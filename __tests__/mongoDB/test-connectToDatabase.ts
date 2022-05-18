import MongoDB from '../../src/database/mongoDB';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

beforeEach(() => {
  mongoose.connection.close();
  jest.resetModules();
});

test('mongoDB class can connect into a Database', () => {
  const db = new MongoDB(process.env.MONGODB_URI as string);

  return db
    .connect()
    .then((returnedValue) => expect(returnedValue).toBe(true))
    .catch((returnedError) => {
      throw returnedError;
    });
});

test('MongoDB connect detect a bad auth error', () => {
  const db = new MongoDB(
    'mongodb+srv://ds:dd@cluster0.qrqwp.mongodb.net/?retryWrites=true&w=majority'
  );

  return db
    .connect()
    .then(() => {
      throw 'the mongoDB connect dont sent a error';
    })
    .catch((returnedError) => {
      const errorToCompare = Error('bad auth : Authentication failed.');
      errorToCompare.name = 'MongoServerError';
      expect(returnedError).toEqual(errorToCompare);
    });
});
