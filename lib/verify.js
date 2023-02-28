const execa = require('execa');
const resolveConfig = require('./resolve-config.js');
const getError = require('./get-error.js');

module.exports = async (pluginConfig, context) => {
  const {cwd, env} = context;
  const errors = [];
  const {ppmToken} = resolveConfig(pluginConfig, context);

  if (!ppmToken) {
    errors.push(getError('ENOPPMTOKEN'));
  }

  if ((await execa('pulsar', ['-v'], {reject: false, cwd, env})).exitCode !== 0) {
    errors.push(getError('ENOPULSARCLI'));
  }

  return errors;
};
