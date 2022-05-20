export interface TestcafeBuilderOptions {
    allowMultipleWindows?: boolean;
    assertionTimeout?: number;
    browsers?: string[]; // default in schema.json
    clientScripts?: string | string[];
    color?: boolean;
    concurrency?: number;
    debugMode?: boolean;
    debugOnFail?: boolean;
    dev?: boolean;
    devServerTarget?: string; // set to run ng serve
    disablePageReloads?: boolean;
    disableScreenshots?: boolean;
    disableTestSyntaxValidation?: boolean;
    fixture?: string;
    fixtureGrep?: string;
    fixtureMeta?: Record<string, string>;
    host?: string; // default in schema.json
    live?: boolean; // default in schema.json
    NoColor?: boolean;
    pageLoadTimeout?: number;
    ports?: number[]; // testcafe ports
    proxy?: string;
    proxyBypass?: string[];
    quarantineMode?: boolean | object;
    reporters?: Reporter[]; // default in schema.json
    screenshots?: Screenshots;
    selectorTimeout?: number;
    skipJsErrors?: boolean;
    skipUncaughtErrors?: boolean;
    speed?: number;
    src: string | string[];
    ssl?: string;
    stopOnFirstFail?: boolean;
    test?: string;
    testGrep?: string;
    testMeta?: Record<string, string>;
    tsConfigPath?: string;
    pageRequestTimeout?: number;
}

export interface Reporter {
    name: string;
    output?: string;
}

export interface Screenshots {
    path?: string;
    takeOnFails?: boolean;
    pathPattern?: string;
    fullPage?: boolean;
}
