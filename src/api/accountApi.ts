import Account from '../accountSystem/account';
import { Request, Response, Application } from 'express';

export default class AccountApi {
  app: any;
  accountFunctions: Account;
  constructor(app: Application, modelAndCollecionName: string) {
    this.app = app;
    this.accountFunctions = new Account(
      modelAndCollecionName,
      modelAndCollecionName
    );
  }

  setApi() {
    this.app.post('/createUser', async (req: Request, res: Response) => {
      const { email, password } = req.body;

      if (!req.body || !email || !password) {
        return res.status(400).json({ error: 'empty email or password' });
      }

      try {
        const accountCreated = await this.accountFunctions.create({
          email,
          password,
        });
        return res.status(200).json({
          email: accountCreated.email,
          token: accountCreated.token,
        });
      } catch (err) {
        return res.status(400).json({ error: err });
      }
    });
  }
}
