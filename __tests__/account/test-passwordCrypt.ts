import passwordCrypt from '../../src/accountSystem/tools/passwordCrypt';

test('PasswordCrypt can crypt a password', async () => {
  const password = 'testPass';
  const encryptedPassword = await passwordCrypt.crypt(password);
  expect(typeof encryptedPassword).toBe('string');
});

test('PasswordCrypt can say if the password is correct', async () => {
  const password = 'testPass';
  const encryptedPassword = await passwordCrypt.crypt(password);

  const result = await passwordCrypt.check(password, encryptedPassword);
  expect(result).toBe(true);
});
