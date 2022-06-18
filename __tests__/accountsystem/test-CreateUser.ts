import Account from '../../src/api/account/accountSystem/account';
import MongoDB from '../../src/database/mongoDB';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();
const collectionName = 'accounttests';

const modelScheme = {
  email: String,
  password: String,
  createdAt: Date,
  premium: Boolean,
  admin: Boolean,
  token: { token: String, createdAt: Date },
};
const accountModel = MongoDB.createModel(
  'testeaccount',
  modelScheme,
  'testeaccount'
);
const accountFunctions = new Account(accountModel);

afterAll(() => {
  mongoose.connection.db.dropCollection(collectionName);
});

beforeAll(async () => {
  const db = new MongoDB(process.env.MONGODB_URI as string);
  db.connect();
  await accountFunctions.dbModel.remove({});
});

test('accountFunctions create a new user', async () => {
  return accountFunctions.create({
    email: 'eduardo@testNewUser.com',
    password: 'testPassNewUser',
  }, async (err: Error, returnedDocument: any) => {
    if(err) throw err
    const userFoundOnDB = await accountFunctions.dbModel
    .findOne({ _id: returnedDocument._id })
    .exec();
    return expect(userFoundOnDB.token).toStrictEqual(returnedDocument.token);
  });
});