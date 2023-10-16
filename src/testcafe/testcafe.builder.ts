import {
    BuilderContext,
    BuilderOutput,
    createBuilder,
    targetFromTargetString
} from '@angular-devkit/architect';
import { JsonObject } from '@angular-devkit/core';
import { TestcafeBuilderOptions } from './schema';
import { isMatch } from 'lodash';
const createTestCafe = require('testcafe');

async function runTests (testCafe, opts: TestcafeBuilderOptions): Promise<unknown> {
    const proxy = opts.proxy;
    const proxyBypass = opts.proxyBypass;

    const runner = opts.live
        ? testCafe.createLiveModeRunner()
        : testCafe.createRunner();

    runner.isCli = true;

    return runner
        .useProxy(proxy, proxyBypass)
        .src(opts.src instanceof Array ? opts.src : [ opts.src ])
        .tsConfigPath(opts.tsConfigPath)
        .browsers(opts.browsers)
        .clientScripts(opts.clientScripts || [])
        .reporter(opts.reporters)
        .concurrency(opts.concurrency || 1)
        .filter((testName, fixtureName, fixturePath, testMeta, fixtureMeta) => {
            if (opts.test && testName !== opts.test) return false;

            if (opts.testGrep && !RegExp(opts.testGrep).test(testName))
                return false;

            if (opts.fixture && fixtureName !== opts.fixture) return false;

            if (opts.fixtureGrep && !RegExp(opts.fixtureGrep).test(fixtureName))
                return false;

            if (opts.testMeta && !isMatch(testMeta, opts.testMeta)) return false;

            if (opts.fixtureMeta && !isMatch(fixtureMeta, opts.fixtureMeta))
                return false;

            return true;
        })
        .screenshots(opts.screenshots)
        .run({
            allowMultipleWindows: opts.allowMultipleWindows,
            assertionTimeout:     opts.assertionTimeout,
            debugMode:            opts.debugMode,
            debugOnFail:          opts.debugOnFail,
            pageLoadTimeout:      opts.pageLoadTimeout,
            quarantineMode:       opts.quarantineMode,
            selectorTimeout:      opts.selectorTimeout,
            skipJsErrors:         opts.skipJsErrors,
            skipUncaughtErrors:   opts.skipUncaughtErrors,
            speed:                opts.speed,
            stopOnFirstFail:      opts.stopOnFirstFail,
            pageRequestTimeout:   opts.pageRequestTimeout,
        });
}

async function execute (
    options: TestcafeBuilderOptions,
    context: BuilderContext
): Promise<BuilderOutput> {
    let server;
    let serverOptions;
    let testCafe;

    if (options.devServerTarget) {
        const target = targetFromTargetString(options.devServerTarget);

        serverOptions = await context.getTargetOptions(target);

        server = await context.scheduleTarget(target);
        const result = await server.result;

        if (!result.success) {
            console.log('SERVER.RESULT IS NOT SUCCESS!!!');
            return { success: false };
        }
    }

    try {
        const host  = serverOptions ? serverOptions.host : options.host;
        const port1 = options.ports && options.ports[0];
        const port2 = options.ports && options.ports[1];

        testCafe = await createTestCafe(
            host,
            port1,
            port2,
            options.ssl,
            options.dev
        );

        const failedCount = await runTests(testCafe, options);

        if (failedCount > 0)
            return { success: false };

        return { success: true };
    }
    catch (e) {
        const message = e instanceof Error ? e.message : 'Testcafe run failed!';

        console.error('Testcafe run failed!!! error:', message);
        return { success: false, error: message };
    }
    finally {
        if (server)
            await server.stop();

        if (testCafe)
            await testCafe.close();
    }
}

export default createBuilder<JsonObject & TestcafeBuilderOptions>(execute);
