import {
  BuilderContext,
  BuilderOutput,
  createBuilder,
  targetFromTargetString,
} from '@angular-devkit/architect';
import { JsonObject, tags } from '@angular-devkit/core';
import * as url from 'url';
import { isMatch } from 'lodash';
import { TestcafeBuilderOptions } from './schema';

//TODO: change code to fit angular 8: https://blog.angularindepth.com/angular-cli-under-the-hood-builders-demystified-v2-e73ee0f2d811

function runTestcafe(root: String, options: TestcafeBuilderOptions): Promise<BuilderOutput> {
  const port1 = options.ports && options.ports[0];
  const port2 = options.ports && options.ports[1];
  const concurrency = options.concurrency || 1;
  const externalProxyHost = options.proxy;
  const proxyBypass = options.proxyBypass;
  const createTestCafe = require('testcafe');
  return createTestCafe(options.host, port1, port2, options.ssl, options.dev).then((testCafe) => {
    const runner = testCafe.createRunner();
    return runner
        .useProxy(externalProxyHost, proxyBypass)
        .src(options.src)
        .browsers(options.browsers)
        .concurrency(concurrency)
        .reporter(options.reporters)
        .filter((testName, fixtureName, fixturePath, testMeta, fixtureMeta) => {
          if (options.test && testName !== options.test)
            return false;

          if (options.testGrep && !RegExp(options.testGrep).test(testName))
            return false;

          if (options.fixture && fixtureName !== options.fixture)
            return false;

          if (options.fixtureGrep && !RegExp(options.fixtureGrep).test(fixtureName))
            return false;

          if (options.testMeta && !isMatch(testMeta, options.testMeta))
            return false;

          if (options.fixtureMeta && !isMatch(fixtureMeta, options.fixtureMeta))
            return false;

          return true;
        })
        .screenshots(options.screenshotsPath, options.screenshotsOnFails, options.screenshotsPathPattern)
        .once('done-bootstrapping', () => {
        })
        .run(options).then((numFailed: number) => {
          testCafe.close();
          process.exit(numFailed ? 1 : 0)
        }, (err: Error) => {
          console.error('error happened', err);
          testCafe.close();
          process.exit(1);
        });
  }) as Promise<BuilderOutput>;
}

export async function execute(
    options: TestcafeBuilderOptions,
    context: BuilderContext,
): Promise<BuilderOutput> {
  // ensure that only one of these options is used
  if (options.devServerTarget && options.baseUrl) {
    throw new Error(tags.stripIndents`
    The 'baseUrl' option cannot be used with 'devServerTarget'.
    When present, 'devServerTarget' will be used to automatically setup 'baseUrl' for Protractor.
    `);
  }

  let baseUrl;
  let server;
  if (options.devServerTarget) {
    const target = targetFromTargetString(options.devServerTarget);
    const serverOptions = await context.getTargetOptions(target);

    const overrides: Record<string, string | number | boolean> = { watch: false };
    if (options.host !== undefined) {
      overrides.host = options.host;
    } else if (typeof serverOptions.host === 'string') {
      options.host = serverOptions.host;
    } else {
      options.host = overrides.host = 'localhost';
    }

    if (options.port !== undefined) {
      overrides.port = options.port;
    } else if (typeof serverOptions.port === 'number') {
      options.port = serverOptions.port;
    }

    server = await context.scheduleTarget(target, overrides);
    const result = await server.result;
    if (!result.success) {
      return { success: false };
    }

    if (typeof serverOptions.publicHost === 'string') {
      let publicHost = serverOptions.publicHost as string;
      if (!/^\w+:\/\//.test(publicHost)) {
        publicHost = `${serverOptions.ssl
            ? 'https'
            : 'http'}://${publicHost}`;
      }
      const clientUrl = url.parse(publicHost);
      baseUrl = url.format(clientUrl);
    } else if (typeof result.baseUrl === 'string') {
      baseUrl = result.baseUrl;
    } else if (typeof result.port === 'number') {
      baseUrl = url.format({
        protocol: serverOptions.ssl ? 'https' : 'http',
        hostname: options.host,
        port: result.port.toString(),
      });
    }
  }

  try {
    return await runTestcafe(context.workspaceRoot, options);
  } catch {
    return { success: false };
  } finally {
    if (server) {
      await server.stop();
    }
  }
}

export default createBuilder<JsonObject & TestcafeBuilderOptions>(execute);
