export interface TestcafeBuilderOptions {
    allowMultipleWindows?: boolean;
    assertionTimeout?: number;
    browsers?: string[]; // default in schema.json
    clientScripts?: string | string[] | ClientScript | ClientScript[]; 
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
    fixtureMeta?: object;
    host?: string; // default in schema.json
    live?: boolean; // default in schema.json
    NoColor?: boolean;
    pageLoadTimeout?: number;
    ports?: number[]; // testcafe ports
    proxy?: string;
    proxyBypass?: string[];
    quarantineMode?: boolean;
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
    testMeta?: object;
    tsConfigPath?: string;
    video?: Videos
}

export interface ClientScript {
    module?: string;
    path?: string;
    content?: string;
}
export interface Reporter {
    name: string,
    output?: string;
}

export interface Screenshots {
    path?: string;
    takeOnFails?: boolean;
    pathPattern?: string;
    fullPage?: boolean;
}

export interface Videos {
    path?: string;
    options?: VideoOptions;
    encodingOptions?: any; // this one is super hairy and is defined by FFMPeg
}

export interface VideoOptions {
    failedOnly?: boolean;
    singleFile?: boolean;
    ffmpegPath?: string;
    pathPattern?: string;
}

