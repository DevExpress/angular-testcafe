import {
	BuilderContext,
	BuilderOutput,
	createBuilder,
	targetFromTargetString
} from "@angular-devkit/architect";
import { JsonObject, tags } from "@angular-devkit/core";
import { TestcafeBuilderOptions } from "./schema";
import * as url from "url";
import { isMatch } from "lodash";
const createTestCafe = require("testcafe");

async function runTestcafe(opts: TestcafeBuilderOptions) {
	const port1 = opts.ports && opts.ports[0];
	const port2 = opts.ports && opts.ports[1];
	const proxy = opts.proxy;
	const proxyBypass = opts.proxyBypass;

	const testCafe = await createTestCafe(
		opts.host,
		port1,
		port2,
		opts.ssl,
		opts.dev
	);

	const runner = opts.live
		? testCafe.createLiveModeRunner()
		: testCafe.createRunner();

	runner.isCli = true;

	return runner
		.useProxy(proxy, proxyBypass)
		.src(opts.src)
		.browsers(opts.browsers)
		// .reporter(opts.reporters)
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
		.screenshots(
			opts.screenshotsPath || ".",
			opts.screenshotsOnFails,
			opts.screenshotsPathPattern
		)
		.run(opts);

}

async function execute(
	options: TestcafeBuilderOptions,
	context: BuilderContext
): Promise<BuilderOutput> {
	// ensure that only one of these options is used
	if (options.devServerTarget && options.baseUrl) {
		throw new Error(tags.stripIndents`
    The 'baseUrl' option cannot be used with 'devServerTarget'.
    `);
	}

	let baseUrl;
	let server;
	if (options.devServerTarget) {
		const target = targetFromTargetString(options.devServerTarget);
		const serverOptions = await context.getTargetOptions(target);

		const overrides: Record<string, string | number | boolean> = {
			watch: false
		};
		if (options.host !== undefined) {
			overrides.host = options.host;
		} else if (typeof serverOptions.host === "string") {
			options.host = serverOptions.host;
		} else {
			options.host = overrides.host = "localhost";
		}

		if (options.port !== undefined) {
			overrides.port = options.port;
		} else if (typeof serverOptions.port === "number") {
			options.port = serverOptions.port;
		}

		server = await context.scheduleTarget(target, overrides);
		const result = await server.result;
		if (!result.success) {
			return { success: false };
		}

		if (typeof serverOptions.publicHost === "string") {
			let publicHost = serverOptions.publicHost as string;
			if (!/^\w+:\/\//.test(publicHost)) {
				publicHost = `${serverOptions.ssl ? "https" : "http"}://${publicHost}`;
			}
			const clientUrl = url.parse(publicHost);
			baseUrl = url.format(clientUrl);
		} else if (typeof result.baseUrl === "string") {
			baseUrl = result.baseUrl;
		} else if (typeof result.port === "number") {
			baseUrl = url.format({
				protocol: serverOptions.ssl ? "https" : "http",
				hostname: options.host,
				port: result.port.toString()
			});
		}
	}

	try {
		const failedCount = await runTestcafe({ ...options, baseUrl });
		if (failedCount > 0) {
			return { success: false }
		} else {
			return { success: true }
		}
	} catch (e) {
		return { success: false };
	} finally {
		if (server) {
			await server.stop();
		}
	}
}

export default createBuilder<JsonObject & TestcafeBuilderOptions>(execute);
