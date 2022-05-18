import MongoDB from '../../../src/database/mongoDB';

test('model as created with same name', () => {
  const model = MongoDB.createModel('testSameName', { test: 'string' });
  expect(model.modelName).toBe('testSameName');
});

test('model sent a error if exist a wrong type in the schema', () => {
  try {
    MongoDB.createModel('testWrongType', { test: 'notAType' });
  } catch (err) {
    const errorToCompare = Error(
      'Invalid schema configuration: `NotAType` is not a valid type at path `test`. See https://bit.ly/mongoose-schematypes for a list of valid schema types.'
    );
    errorToCompare.name = 'TypeError';

    expect(err).toEqual(errorToCompare);
  }
});
