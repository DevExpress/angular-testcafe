import {
  Builder,
  BuilderConfiguration,
  BuilderContext,
  BuilderDescription,
  BuildEvent
} from '@angular-devkit/architect';
import { Observable, of } from 'rxjs';
import { concatMap, take, tap } from 'rxjs/operators';
import { Path, resolve } from '@angular-devkit/core';
import * as url from 'url';
import { DevServerBuilderOptions } from '@angular-devkit/build-angular';
import { TestcafeBuilderSchema } from './schema';



export default class TestcafeBuilder implements Builder<TestcafeBuilderSchema> {

  constructor(public context: BuilderContext) { }

  run(builderConfig: BuilderConfiguration<TestcafeBuilderSchema>): Observable<BuildEvent> {

    const options = builderConfig.options;
    const root = this.context.workspace.root;
    const projectRoot = resolve(root, builderConfig.root);
    // const projectSystemRoot = getSystemPath(projectRoot);

    // TODO: verify using of(null) to kickstart things is a pattern.
    return of(null).pipe(
      concatMap(() => options.devServerTarget ? this._startDevServer(options) : of(null)),
      concatMap(() => this._runTestcafe(root, options)),
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

  private _runTestcafe(root: Path, options: TestcafeBuilderSchema): Observable<BuildEvent> {

    const createTestCafe = require('testcafe');
    let runner           = null;

    createTestCafe(options.baseUrl, 1337, 1338)
      .then((testcafe: any) => {
        runner = testcafe.createRunner();

        return testcafe.createBrowserConnection();
      });

    runner
      .src(options.src)
      .browsers(options.browsers)
      .reporter(options.reporter)
      .run()
      .then(failedCount => {
        /* ... */
      })
      .catch(error => {
        /* ... */
      });
  }
}
