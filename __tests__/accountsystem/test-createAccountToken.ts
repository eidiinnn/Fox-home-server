import createAccountToken from '../../src/api/account/accountSystem/tools/createAccountToken';

test('createAccountToken works ', () => {
  const token = createAccountToken();
  expect(token.token).toBeDefined();
});
