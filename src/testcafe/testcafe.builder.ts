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

export interface TestcafeBuilderSchema {
  devServerTarget?: string;
  src: string;
  browsers: string[];
  reporter: string;
  port?: number;
  host: string;
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

    const createTestCafe = require('testcafe');
    let tc: any;

    return from(
      createTestCafe(options.host).then((testcafe: any) => {
        tc = testcafe;
        return tc
          .createRunner()
          .src(options.src)
          .browsers(options.browsers)
          .reporter(options.reporter)
          .run();
      }).then((numFailed: number) => {
        console.log('finished with ', numFailed, ' errors');
        tc.close();
      }, (err: Error ) => {
        console.error('error happened', err);
        tc.close();
      })
    ).pipe(map(() => ({ success: true })));
  }
}
