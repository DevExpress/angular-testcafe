export interface TestcafeBuilderOptions {
    devServerTarget?: string;
    src: string;
    browsers: string[];
    host: string;
    port?: number;
    baseUrl?: string;
    reporters: Reporter[];
    live?: boolean;
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
    output?: string;
}