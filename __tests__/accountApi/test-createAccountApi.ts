import Account from '../../src/accountSystem/account';
import MongoDB from '../../src/database/mongoDB';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import AccountApi from '../../src/api/accountApi';
const request = require('supertest');
const express = require('express');

const app = express();
app.use(express.json());
dotenv.config();

const collectionName = 'createaccountapis';
const accountFunctions = new Account('AccountTest', collectionName);

afterAll(() => {
  mongoose.connection.db.dropCollection(collectionName);
});

beforeAll(async () => {
  const db = new MongoDB(process.env.MONGODB_URI as string);
  db.connect();
  await accountFunctions.dbModel.remove({});
});

const accountApi = new AccountApi(app, collectionName);
accountApi.setApi();

test('detect empty password', () => {
  return request(app)
    .post('/createUser')
    .send({ email: 'teste@teste.com' })
    .expect('Content-Type', /json/)
    .expect({ error: 'empty email or password' })
    .expect(400);
});

test('detect empty email', () => {
  return request(app)
    .post('/createUser')
    .send({ password: 'password' })
    .expect('Content-Type', /json/)
    .expect({ error: 'empty email or password' })
    .expect(400);
});

test('detect a non email', () => {
  return request(app)
    .post('/createUser')
    .send({ email: 'not a email', password: 'password' })
    .expect('Content-Type', /json/)
    .expect({ error: 'not email type' })
    .expect(400);
});

test('detect a same email on database', async () => {
  const emailAndPassword = {
    email: 'testeDetectSameEmail@test.com',
    password: 'testepass',
  };
  await accountFunctions.create(emailAndPassword);
  return request(app)
    .post('/createUser')
    .send(emailAndPassword)
    .expect('Content-Type', /json/)
    .expect({ error: 'Exist another same email' })
    .expect(400);
});

test('create a account', () => {
  return request(app)
    .post('/createUser')
    .send({ email: 'createAccountTest@test.com', password: 'testPassword' })
    .expect('Content-Type', /json/)
    .expect(200);
});
