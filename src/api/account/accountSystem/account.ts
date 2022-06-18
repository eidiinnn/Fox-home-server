import { ObjectId, Model } from 'mongoose';
import createAccountToken from './tools/createAccountToken';
import passwordCrypt from './tools/passwordCrypt';

type CreateData = { email: string; password: string };

export default class Account {
  dbModel: any;
  constructor(dbModel: any) {
    this.dbModel = dbModel;
  }

  // async verifyLogin(email: string, password: string) {
  //   return new Promise(async (resolve, reject) => {
  //     const accountData = await this.dbModel.findOne({ email });
  //     if (!accountData) return reject(Error('Email not found'));
  //     const isTheSame = await passwordCrypt.check(
  //       password,
  //       accountData.password
  //     );
  //     isTheSame ? resolve(true) : reject(Error('Incorrect password'));
  //   });
  // }

  async create(data: CreateData, callback?: Function) {
    const accountToBeSave = new this.dbModel({
      ...data,
      createdAt: new Date(),
      premium: false,
      admin: false,
      token: createAccountToken(),
      password: await passwordCrypt.crypt(data.password),
    });

    accountToBeSave.save((err: Error, documentCreated: any) => {
      if(!callback) return {err, documentCreated};
      if (err) return callback(err, null);
      return callback(null, {
        _id: documentCreated._id,
        email: documentCreated.email,
        premium: documentCreated.premium,
        admin: documentCreated.admin,
        token: documentCreated.token,
      });
    });
  }
}
