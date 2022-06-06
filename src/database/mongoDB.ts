import mongoose from 'mongoose';

export default class MongoDB {
  dbUri: string;
  connectOptions: { serverSelectionTimeoutMS: number };

  constructor(uri: string) {
    this.dbUri = uri;
    this.connectOptions = { serverSelectionTimeoutMS: 5000 };
  }

  static createModel(name: string, schema: object, collection?: string) {
    const createdSchema = new mongoose.Schema(schema, {collection: collection});
    return mongoose.model(name, createdSchema);
  }
 
  connect() {
    return new Promise((resolve, reject) => {
      mongoose.connect(this.dbUri, this.connectOptions, (err) => {
        !err ? resolve(true) : reject(err);
      });
    });
  }
}
