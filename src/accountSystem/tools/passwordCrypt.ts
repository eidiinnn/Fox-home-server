import bcrypt from 'bcrypt';

const passwordCrypt = {
  salt: 10,

  crypt: async (password: string) => {
    const generatedSalt = await bcrypt.genSalt(passwordCrypt.salt);
    const encryptedPassword = await bcrypt.hash(password, generatedSalt);
    return Promise.resolve(encryptedPassword);
  },

  check: async (password: string, hash: string) => {
    const isTheSame = await bcrypt.compare(password, hash);
    return Promise.resolve(isTheSame);
  },
};

export default passwordCrypt;
