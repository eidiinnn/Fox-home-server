import dotenv from 'dotenv';
import MongoDB from './database/mongoDB';
import AccountApi from './api/account/accountApi';
const express = require('express');

const app = express();
app.use(express.json());
dotenv.config();

async function start() {
  try {
    console.log('connection to database...');
    const db = new MongoDB(process.env.MONGODB_URI as string);
    await db.connect();

    console.log('confing account system and api...');
    const accountApi = new AccountApi(app);
    accountApi.setApi();

    console.log('setting the server...');
    app.listen(8080, () => console.log('working on port: 8080'));
  } catch (err) {
    console.error(err);
  }
}

start();
