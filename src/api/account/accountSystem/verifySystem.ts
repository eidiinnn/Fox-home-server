type Params = {
  email?: string;
  password?: string;
};

export default class Verify {
  error: string[];
  params: Params;
  dbModel: any;

  constructor(dbModel: any, params: Params) {
    this.dbModel = dbModel;
    this.error = [];
    this.params = params;
  }

  verifyEmailOrPasswordIsEmpty() {
    if (!this.params.email || !this.params.password) {
      this.error.push('empty email or password');
    }
  }

  passwordHas5Caracters(){
    if(!this.params.password) return null
    if(this.params.password.length < 5) this.error.push('password need more than 5 caracters');
  }

  validateEmail() {
    if (
      !String(this.params.email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    ) {
        this.error.push('not email type');
    }
  }

  async verifyHasAnotherEmail() {
    const verifyEmail = await this.dbModel
      .find({ email: this.params.email })
      .exec();
    if (verifyEmail.length >= 1) this.error.push('Exist another same email');
  }
}
