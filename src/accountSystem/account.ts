import { ObjectId } from 'mongoose';
import MongoDB from '../database/mongoDB';
import createAccountToken from './tools/createAccountToken';
import passwordCrypt from './tools/passwordCrypt';

type CreateData = { email: string; password: string };
type CreateAccountResolve = {
  [key: string]: any;
  _id: ObjectId;
  email: String;
  premium: Boolean;
  admin: Boolean;
  token: Object;
};

export default class Account {
  dbModel: any;
  constructor(modelName: string) {
    this.dbModel = MongoDB.createModel(modelName, {
      email: String,
      password: String,
      createdAt: Date,
      premium: Boolean,
      admin: Boolean,
      token: { token: String, createdAt: Date },
    });
  }

  async verifyLogin(email: string, password: string) {
    return new Promise(async (resolve, reject) => {
      const accountData = await this.dbModel.findOne({ email });
      if (!accountData) return reject(Error('Email not found'));
      const isTheSame = await passwordCrypt.check(
        password,
        accountData.password
      );
      isTheSame ? resolve(true) : reject(Error('Incorrect password'));
    });
  }

  async create(data: CreateData): Promise<CreateAccountResolve> {
    return new Promise(async (resolve, reject) => {
      const accountToBeSave = new this.dbModel({
        ...data,
        createdAt: new Date(),
        premium: false,
        admin: false,
        token: createAccountToken(),
        password: await passwordCrypt.crypt(data.password),
      });

      if (!this.validateEmail(data.email)) {
        return reject(Error('not email type'));
      }
      if (await this.verifyHasAnotherEmail(data.email)) {
        return reject(Error('Exist another same email'));
      }

      accountToBeSave.save((err: Error, documentCreated: any) => {
        if (err) reject(err);
        else
          resolve({
            _id: documentCreated._id,
            email: documentCreated.email,
            premium: documentCreated.premium,
            admin: documentCreated.admin,
            token: documentCreated.token,
          });
      });
    });
  }

  validateEmail(email: string) {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  }

  async verifyHasAnotherEmail(email: string) {
    const verifyEmail = await this.dbModel.find({ email }).exec();
    if (verifyEmail.length > 1) return true;
    else return false;
  }
}
