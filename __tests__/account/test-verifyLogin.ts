import Account from '../../src/accountSystem/account';
import MongoDB from '../../src/database/mongoDB';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

const collection = 'accounttests';
const accountFunctions = new Account('AccountTest', collection);

afterAll(() => {
  mongoose.connection.db.dropCollection(collection);
});

beforeAll(async () => {
  const db = new MongoDB(process.env.MONGODB_URI as string);
  db.connect();
  await accountFunctions.dbModel.remove({});
});

test('verifyEmailPassword works', async () => {
  const accountInfo = {
    email: 'teste@teste.com',
    password: 'testPassword',
  };
  await accountFunctions.create(accountInfo);

  const result = await accountFunctions.verifyLogin(
    accountInfo.email,
    accountInfo.password
  );

  expect(result).toBe(true);
});

test('verifyEmailPassword detect a wrong password', async () => {
  const accountInfo = {
    email: 'testeWrongPassword@teste.com',
    password: 'testPassword',
  };
  await accountFunctions.create(accountInfo);

  return accountFunctions
    .verifyLogin(accountInfo.email, `notThePassword`)
    .catch((err) => {
      return expect(err).toStrictEqual(Error('Incorrect password'));
    });
});

test('verifyEmailPassword detect a wrong email', async () => {
  const accountInfo = {
    email: 'testeWrongEmail@teste.com',
    password: 'testPassword',
  };
  await accountFunctions.create(accountInfo);

  return accountFunctions
    .verifyLogin('wrongEmail@teste.com', accountInfo.password)
    .then(() => {
      throw 'resolve the promise';
    })
    .catch((err) => {
      return expect(err).toStrictEqual(Error('Email not found'));
    });
});
