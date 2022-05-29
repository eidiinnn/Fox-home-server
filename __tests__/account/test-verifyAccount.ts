import Account from '../../src/accountSystem/account';
import MongoDB from '../../src/database/mongoDB';
import dotenv from 'dotenv';
dotenv.config();

beforeAll(async () => {
  const db = new MongoDB(process.env.MONGODB_URI as string);
  db.connect();
});

const accountFunctions = new Account('AccountTest');

test('verify works', async () => {
  const createdUser = await accountFunctions.create({
    email: 'eduardo@test.com',
    password: 'testPass',
  });
  const compare = await accountFunctions.verify(createdUser._id, 'testPass');
  expect(compare).toBe(true);
});
