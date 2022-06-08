import Account from '../../src/accountSystem/account';
import MongoDB from '../../src/database/mongoDB';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();
const collectionName = 'accounttests';
const accountFunctions = new Account('AccountTest', collectionName);

afterAll(() => {
  mongoose.connection.db.dropCollection(collectionName);
});

beforeAll(async () => {
  const db = new MongoDB(process.env.MONGODB_URI as string);
  db.connect();
  await accountFunctions.dbModel.remove({});
});

test('accountFunctions create a new user', async () => {
  const returnedDocument = await accountFunctions.create({
    email: 'eduardo@testNewUser.com',
    password: 'testPassNewUser',
  });
  const userFoundOnDB = await accountFunctions.dbModel
    .findOne({ _id: returnedDocument._id })
    .exec();
  return expect(userFoundOnDB.token).toStrictEqual(returnedDocument.token);
});

test('accountFunctions detect if has another account with same email', async () => {
  await accountFunctions.create({
    email: 'eduardo@testHasEmail.com',
    password: 'testPassNewUser',
  });

  return await accountFunctions
    .create({
      email: 'eduardo@testHasEmail.com',
      password: 'testPassNewUser',
    })
    .catch((valueReturned) => {
      return expect(valueReturned).toStrictEqual('Exist another same email');
    });
});

test('accountFunctions detect if is not a email type', () => {
  return accountFunctions
    .create({ email: 'not email type', password: 'testePassword' })
    .then(() => {
      throw 'resolve the promise';
    })
    .catch((err) => {
      return expect(err).toStrictEqual('not email type');
    });
});
