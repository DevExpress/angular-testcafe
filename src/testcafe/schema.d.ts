export interface TestcafeBuilderOptions {
    src: string | string[];
    browsers?: string[]; // default in schema.json
    reporters?: Reporter[]; // default in schema.json
    devServerTarget?: string; // set to run ng serve
    host?: string; // default in schema.json
    live?: boolean; // default in schema.json
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
    ports?: number[]; // testcafe ports
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
    tsConfigPath?: string;
}

export interface Reporter {
    name: string,
    output?: string;
}
