import Account from './accountSystem/account';
import MongoDB from '../../database/mongoDB';
import Verify from './accountSystem/verifySystem';
import { Request, Response, Application } from 'express';

type Options = {modelName: string, collectionName: string}
const defaultOptions = {modelName: 'accountModel', collectionName:'fox-account'};

export default class AccountApi {
  app: Application;
  accountFunctions: any;
  accountModel: any;
  verify: any;

  constructor(app: Application, options: Options = {...defaultOptions}){
    const modelScheme = {
      email: String,
      password: String,
      createdAt: Date,
      premium: Boolean,
      admin: Boolean,
      token: { token: String, createdAt: Date },
    };
    this.accountModel = MongoDB.createModel(
      options.modelName,
      modelScheme,
      options.collectionName
    );

    this.app = app;
    this.accountFunctions = new Account(this.accountModel);
  }

  setApi() {
    this.app.post('/createUser', async (req: Request, res: Response) => {
      const { email, password } = req.body;

      const verify = new Verify(this.accountModel, { email, password });
      verify.verifyEmailOrPasswordIsEmpty();
      verify.validateEmail();
      verify.passwordHas5Caracters();
      await verify.verifyHasAnotherEmail();
      

      if(verify.error.length >= 1) return res.status(400).json({error: verify.error});

      this.accountFunctions.create(
        { email, password },
        (err: any, documentCreated: any) => {
          if (err) return res.status(500);
          return res.status(200).json({
            email: documentCreated.email,
            token: documentCreated.token,
          });
        }
      );
    });
  }

}
