const path = require('path');
const test = require('ava');
const {outputJson, readJson, outputFile, readFile} = require('fs-extra');
const tempy = require('tempy');
const execa = require('execa');
const {stub} = require('sinon');
const {WritableStreamBuffer} = require('stream-buffers');
const prepare = require('../lib/prepare.js');

test.beforeEach((t) => {
  t.context.log = stub();
  t.context.logger = {log: t.context.log};
  t.context.stdout = new WritableStreamBuffer();
  t.context.stderr = new WritableStreamBuffer();
});

test('Updade package.json', async (t) => {
  const cwd = tempy.directory();
  const packagePath = path.resolve(cwd, 'package.json');
  await outputJson(packagePath, {version: '0.0.0-dev'});

  await prepare(
    {},
    {
      cwd,
      env: {},
      stdout: t.context.stdout,
      stderr: t.context.stderr,
      nextRelease: {version: '1.0.0'},
      logger: t.context.logger,
    }
  );

  // Verify package.json has been updated
  t.is((await readJson(packagePath)).version, '1.0.0');

  // Verify the logger has been called with the version updated
  t.is(t.context.log.args[0][0], 'Write version 1.0.0 to package.json');
});

test('Updade package.json and npm-shrinkwrap.json', async (t) => {
  const cwd = tempy.directory();
  const packagePath = path.resolve(cwd, 'package.json');
  const shrinkwrapPath = path.resolve(cwd, 'npm-shrinkwrap.json');
  await outputJson(packagePath, {version: '0.0.0-dev'});
  // Create a npm-shrinkwrap.json file
  await execa('npm', ['shrinkwrap'], {cwd});

  await prepare(
    {},
    {
      cwd,
      env: {},
      stdout: t.context.stdout,
      stderr: t.context.stderr,
      nextRelease: {version: '1.0.0'},
      logger: t.context.logger,
    }
  );

  // Verify package.json and npm-shrinkwrap.json have been updated
  t.is((await readJson(packagePath)).version, '1.0.0');
  t.is((await readJson(shrinkwrapPath)).version, '1.0.0');
  // Verify the logger has been called with the version updated
  t.is(t.context.log.args[0][0], 'Write version 1.0.0 to package.json');
});

test('Updade package.json and package-lock.json', async (t) => {
  const cwd = tempy.directory();
  const packagePath = path.resolve(cwd, 'package.json');
  const packageLockPath = path.resolve(cwd, 'package-lock.json');
  await outputJson(packagePath, {version: '0.0.0-dev'});
  // Create a package-lock.json file
  await execa('npm', ['install'], {cwd});

  await prepare(
    {},
    {
      cwd,
      env: {},
      stdout: t.context.stdout,
      stderr: t.context.stderr,
      nextRelease: {version: '1.0.0'},
      logger: t.context.logger,
    }
  );

  // Verify package.json and package-lock.json have been updated
  t.is((await readJson(packagePath)).version, '1.0.0');
  t.is((await readJson(packageLockPath)).version, '1.0.0');
  // Verify the logger has been called with the version updated
  t.is(t.context.log.args[0][0], 'Write version 1.0.0 to package.json');
});

test('Preserve indentation and newline', async (t) => {
  const cwd = tempy.directory();
  const packagePath = path.resolve(cwd, 'package.json');
  await outputFile(packagePath, `{\r\n        "name": "package-name",\r\n        "version": "0.0.0-dev"\r\n}\r\n`);

  await prepare(
    {},
    {
      cwd,
      env: {},
      stdout: t.context.stdout,
      stderr: t.context.stderr,
      nextRelease: {version: '1.0.0'},
      logger: t.context.logger,
    }
  );

  // Verify package.json has been updated
  t.is(
    await readFile(packagePath, 'utf8'),
    `{\r\n        "name": "package-name",\r\n        "version": "1.0.0"\r\n}\r\n`
  );

  // Verify the logger has been called with the version updated
  t.is(t.context.log.args[0][0], 'Write version 1.0.0 to package.json');
});
