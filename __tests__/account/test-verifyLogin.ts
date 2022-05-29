import Account from '../../src/accountSystem/account';
import MongoDB from '../../src/database/mongoDB';
import dotenv from 'dotenv';
dotenv.config();

const accountFunctions = new Account('AccountTest');

beforeAll(async () => {
  const db = new MongoDB(process.env.MONGODB_URI as string);
  db.connect();
  await accountFunctions.dbModel.remove({});
});

test('verify password works', async () => {
  const accountCreated = await accountFunctions.create({
    email: 'eduardo@testVerifyPassword.com',
    password: 'testPassNewUser',
  });

  return expect(
    await accountFunctions.verifyPassword(accountCreated._id, 'testPassNewUser')
  ).toBe(true);
});
