import {
  Builder,
  BuilderConfiguration,
  BuilderContext,
  BuilderDescription,
  BuildEvent
} from '@angular-devkit/architect';
import { Observable, of, from } from 'rxjs';
import { concatMap, take, tap, map } from 'rxjs/operators';
import { DevServerBuilderOptions } from '@angular-devkit/build-angular';
import * as url from 'url';
import { isMatch } from 'lodash';

export interface TestcafeBuilderSchema {
  devServerTarget?: string;
  src: string;
  browsers: string[];
  host: string;
  port?: number;
  reporters: Reporter[];
  concurrency?: number;
  screenshotsPath?: string;
  screenshotsOnFails?: boolean;
  screenshotsPathPattern?: string;
  quarantineMode?: boolean;
  debugMode?: boolean;
  skipJsErrors?: boolean;
  skipUncaughtErrors?: boolean;
  debugOnFail?: boolean;
  selectorTimeout?: number;
  assertionTimeout?: number;
  pageLoadTimeout?: number;
  speed?: number;
  ports?: number[];
  proxy?: string;
  proxyBypass?: string[];
  disablePageReloads?: boolean;
  dev?: boolean;
  stopOnFirstFail?: boolean;
  disableTestSyntaxValidation?: boolean;
  color?: boolean;
  NoColor?: boolean;
  ssl?: string;
  test?: string;
  testGrep?: string;
  testMeta?: object;
  fixture?: string;
  fixtureGrep?: string;
  fixtureMeta?: object;
}

export interface Reporter {
  name: string,
  outStream?: string;
}

export default class TestcafeBuilder implements Builder<TestcafeBuilderSchema> {

  constructor(public context: BuilderContext) { }

  run(builderConfig: BuilderConfiguration<TestcafeBuilderSchema>): Observable<BuildEvent> {

    const options = builderConfig.options;

    return of(null).pipe(
      concatMap(() => options.devServerTarget ? this._startDevServer(options) : of(null)),
      concatMap(() => this._runTestcafe(options)),
      take(1),
    );
  }

  // Note: this method mutates the options argument.
  private _startDevServer(options: TestcafeBuilderSchema) {
    const architect = this.context.architect;
    const [project, targetName, configuration] = (options.devServerTarget as string).split(':');
    // Override dev server watch setting.
    const overrides: Partial<DevServerBuilderOptions> = { watch: false };
    if (options.host !== undefined) { overrides.host = options.host; }
    if (options.port !== undefined) { overrides.port = options.port; }
    const targetSpec = { project, target: targetName, configuration, overrides };
    const builderConfig = architect.getBuilderConfiguration<DevServerBuilderOptions>(targetSpec);
    let devServerDescription: BuilderDescription;
    let baseUrl: string;

    return architect.getBuilderDescription(builderConfig).pipe(
      tap(description => devServerDescription = description),
      concatMap(devServerDescription => architect.validateBuilderOptions(
        builderConfig, devServerDescription)),
      concatMap(() => {
        // Compute baseUrl from devServerOptions.
        if (options.devServerTarget && builderConfig.options.publicHost) {
          let publicHost = builderConfig.options.publicHost;
          if (!/^\w+:\/\//.test(publicHost)) {
            publicHost = `${builderConfig.options.ssl
              ? 'https'
              : 'http'}://${publicHost}`;
          }
          const clientUrl = url.parse(publicHost);
          baseUrl = url.format(clientUrl);
        } else if (options.devServerTarget) {
          baseUrl = url.format({
            protocol: builderConfig.options.ssl ? 'https' : 'http',
            hostname: options.host,
            port: builderConfig.options.port.toString(),
          });
        }

        return of(this.context.architect.getBuilder(devServerDescription, this.context));
      }),
      concatMap(builder => builder.run(builderConfig)),
    );
  }

  private _runTestcafe(options: TestcafeBuilderSchema): Observable<BuildEvent> {
    const port1 = options.ports && options.ports[0];
    const port2 = options.ports && options.ports[1];
    const concurrency = options.concurrency || 1;
    const externalProxyHost = options.proxy;
    const proxyBypass = options.proxyBypass;
    const createTestCafe = require('testcafe');
    return from(createTestCafe(options.host, port1, port2, options.ssl, options.dev).then((testCafe) => {
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
    })).pipe(map(() => ({success: true})));
  }
}
