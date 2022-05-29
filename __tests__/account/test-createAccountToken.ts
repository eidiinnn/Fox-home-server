import createAccountToken from '../../src/accountSystem/tools/createAccountToken';

test('createAccountToken works ', () => {
  const token = createAccountToken();
  expect(token.token).toBeDefined();
});
