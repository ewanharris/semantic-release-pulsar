const execa = require('execa');

module.exports = async (pluginConfig, {name}, context) => {
  const {
    cwd,
    env,
    stdout,
    stderr,
    nextRelease: {gitTag, version},
    logger,
  } = context;

  logger.log(`Publishing version ${version} to pulsar registry`);

  // Copy across the access token to ATOM_ACCESS_TOKEN as pulsar still references that
  Object.assign(env, {
    ATOM_ACCESS_TOKEN: env.PULSAR_ACCESS_TOKEN,
  });
  const result = execa('pulsar', ['--package', 'publish', '--tag', gitTag], {
    cwd,
    env,
  });
  result.stdout.pipe(stdout, {end: false});
  result.stderr.pipe(stderr, {end: false});
  await result;

  logger.log(`Published ${name}@${version}`);
  return {name: 'Pulsar package', url: `https://web.pulsar-edit.dev/packages/${name}`};
};
