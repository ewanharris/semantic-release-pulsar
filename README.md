# semantic-release-pulsar

[**semantic-release**](https://github.com/semantic-release/semantic-release) plugin to publish [Pulsar](https://www.pulsar-edit.dev) packages.

[![Build Status](https://github.com/ewanharris/semantic-release-pulsar/workflows/Test/badge.svg)](https://github.com/ewanharris/semantic-release-pulsar/actions?query=workflow%3ATest+branch%3Amaster)
[![npm latest version](https://img.shields.io/npm/v/semantic-release-pulsar/latest.svg)](https://www.npmjs.com/package/semantic-release-pulsar)

| Step               | Description                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------------- |
| `verifyConditions` | Verify the presence of the `PULSAR_ACCESS_TOKEN` environment variable and the `pulsar` CLI.       |
| `prepare`          | Update the `package.json` version with [`npm version`](https://docs.npmjs.com/cli/version).       |
| `publish`          | [Publish the Pulsar package](https://pulsar-edit.dev/docs/atom-archive/hacking-atom/#publishing). |

## Install

```bash
$ npm install semantic-release-pulsar @semantic-release/git -D
```

**Note**: pulsar require to have the version in `package.json` pushed to the repository so the [`@semantic-release/git`](https://github.com/semantic-release/git) plugin is required.

## Usage

The plugin can be configured in the [**semantic-release** configuration file](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#configuration):

```json
{
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/github",
    "semantic-release-pulsar",
    "@semantic-release/git"
  ]
}
```

## Configuration

### Pulsar installation

The plugin uses the [`pulsar` CLI](https://github.com/pulsar-edit/pulsar) which has to be installed in your CI environment and available in the `PATH`.

See the [Pulsar Action](https://github.com/pulsar-edit/action-pulsar-dependency) documentation to install `pulsar` in your CI.

### Atom authentication

The Pulsar authentication configuration is **required** and can be set via [environment variables](#environment-variables).

Visit your account page on [web.pulsar-edit.dev](https://web.pulsar-edit.dev/users) to obtain your authentication token. The token has to be made available in your CI environment via the `PULSAR_ACCESS_TOKEN` environment variable.

### Environment variables

| Variable            | Description                                            |
| ------------------- | ------------------------------------------------------ |
| `PULSAR_ACCESS_TOKEN` | The token used to authenticate with Pulsar registry. |

## Credits

This package is a fork of the original [apm](https://github.com/semantic-release/apm) package.