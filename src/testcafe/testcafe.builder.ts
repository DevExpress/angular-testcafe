import {
  Builder,
  BuilderConfiguration,
  BuilderContext,
  BuilderDescription,
  BuildEvent
} from '@angular-devkit/architect';
import { Observable, of, from } from 'rxjs';
import { concatMap, take, tap, map } from 'rxjs/operators';
import * as url from 'url';
import { DevServerBuilderOptions } from '@angular-devkit/build-angular';
import * as fs from "fs";

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
}

export interface Reporter {
  name: string,
  outFile?: string;
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
    return from(this._runTests(options)).pipe(map(() => ({ success: true })));
  }

  private async _runTests(opts) {
    const port1             = opts.ports && opts.ports[0];
    const port2             = opts.ports && opts.ports[1];
    const externalProxyHost = opts.proxy;
    const proxyBypass       = opts.proxyBypass;

    const createTestCafe = require('testcafe');
    const testCafe       = await createTestCafe(opts.host, port1, port2, opts.ssl, opts.dev);
    const concurrency    = opts.concurrency || 1;
    const browsers       = opts.browsers.concat();
    const runner         = testCafe.createRunner();
    let failed           = 0;
    const reporters      = opts.reporters.map(r => {
      return {
        name:      r.name,
        outStream: r.outFile ? fs.createWriteStream(r.outFile) : void 0
      };
    });

    reporters.forEach(r => runner.reporter(r.name, r.outStream));

    runner
      .useProxy(externalProxyHost, proxyBypass)
      .src(opts.src)
      .browsers(browsers)
      .concurrency(concurrency)
      .screenshots(opts.screenshotsPath, opts.screenshotsOnFails, opts.screenshotsPathPattern);

    runner.once('done-bootstrapping', () => {});

    try {
      failed = await runner.run(opts);
    } finally {
      await testCafe.close();
    }

    return setTimeout(() => process.exit(failed), 0);
  }
}
