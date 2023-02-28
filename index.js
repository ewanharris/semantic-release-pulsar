/* eslint require-atomic-updates: off */

const AggregateError = require('aggregate-error');
const getPkg = require('./lib/get-pkg.js');
const verifyPulsar = require('./lib/verify.js');
const preparePulsar = require('./lib/prepare.js');
const publishPulsar = require('./lib/publish.js');

let verified;
let prepared;

async function verifyConditions(pluginConfig, context) {
  const errors = await verifyPulsar(pluginConfig, context);

  try {
    await getPkg(pluginConfig, context);
  } catch (error) {
    errors.push(...error);
  }

  if (errors.length > 0) {
    throw new AggregateError(errors);
  }

  verified = true;
}

async function prepare(pluginConfig, context) {
  const errors = verified ? [] : await verifyPulsar(pluginConfig, context);

  try {
    await getPkg(pluginConfig, context);
  } catch (error) {
    errors.push(...error);
  }

  if (errors.length > 0) {
    throw new AggregateError(errors);
  }

  await preparePulsar(pluginConfig, context);

  prepared = true;
}

async function publish(pluginConfig, context) {
  let pkg;
  const errors = verified ? [] : await verifyPulsar(pluginConfig, context);

  try {
    pkg = await getPkg(pluginConfig, context);
  } catch (error) {
    errors.push(...error);
  }

  if (errors.length > 0) {
    throw new AggregateError(errors);
  }

  if (!prepared) {
    await preparePulsar(pluginConfig, context);
    prepared = true;
  }

  return publishPulsar(pluginConfig, pkg, context);
}

module.exports = {verifyConditions, prepare, publish};
