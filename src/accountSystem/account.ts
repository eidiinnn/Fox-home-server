import MongoDB from '../database/mongoDB';
import createAccountToken from './tools/createAccountToken';
import passwordCrypt from './tools/passwordCrypt';

type CreateDataObject = { email: string; password: string };

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

  async create(data: CreateDataObject): Promise<any | Error> {
    const toBeSaved = new this.dbModel({
      ...data,
      createdAt: new Date(),
      premium: false,
      admin: false,
      token: createAccountToken(),
      password: await passwordCrypt.crypt(data.password),
    });

    return new Promise((resolve, reject) => {
      return toBeSaved.save((err: Error, documentCreated: object) => {
        if (!err) return resolve(documentCreated);
        else return reject(err);
      });
    });
  }

  async verify(id: string, password: string): Promise<Boolean> {
    const accountData = await this.dbModel.findOne({ _id: id });
    const isTheSame = await passwordCrypt.check(password, accountData.password);
    return Promise.resolve(isTheSame);
  }
}
