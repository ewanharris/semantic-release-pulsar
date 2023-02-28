const test = require('ava');
const tempy = require('tempy');
const verify = require('../lib/verify.js');

test('Verify "PULSAR_ACCESS_TOKEN" is set', async (t) => {
  t.deepEqual(await verify({}, {env: {PULSAR_ACCESS_TOKEN: 'my_token'}}), []);
});

test('Return SemanticReleaseError if "PULSAR_ACCESS_TOKEN" is not set', async (t) => {
  const [error] = await verify({}, {env: {}});

  t.is(error.name, 'SemanticReleaseError');
  t.is(error.code, 'ENOPPMTOKEN');
  t.truthy(error.message);
  t.truthy(error.details);
});

test('Return SemanticReleaseError if "pulsar" is not installed', async (t) => {
  const [error] = await verify({}, {env: {PULSAR_ACCESS_TOKEN: 'my_token', PATH: tempy.directory()}});

  t.is(error.name, 'SemanticReleaseError');
  t.is(error.code, 'ENOPULSARCLI');
  t.truthy(error.message);
  t.truthy(error.details);
});
