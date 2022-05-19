import Account from '../../src/accountSystem/account';
import MongoDB from '../../src/database/mongoDB';
import dotenv from 'dotenv';
dotenv.config();

beforeAll(async () => {
  const db = new MongoDB(process.env.MONGODB_URI as string);
  db.connect();
});

const accountFunctions = new Account('AccountTest');

test('accountFunctions create a new user', async () => {
  const createdUser = await accountFunctions.create({
    email: 'eduardo@test.com',
    password: 'testPass',
  });
  const userFoundOnDB = await accountFunctions.dbModel
    .findOne({ _id: createdUser._id })
    .exec();

  return expect(userFoundOnDB.email).toBe('eduardo@test.com');
});
