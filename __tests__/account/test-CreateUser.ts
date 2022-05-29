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
      return expect(valueReturned).toStrictEqual(
        Error('Exist another same email')
      );
    });
});
