import MongoDB from '../database/mongoDB';
import createAccountToken from './tools/createAccountToken';

type CreateDataObject = { email: String; password: String };

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
    });

    return new Promise((resolve, reject) => {
      return toBeSaved.save((err: Error, documentCreated: object) => {
        if (!err) return resolve(documentCreated);
        else return reject(err);
      });
    });
  }
}
