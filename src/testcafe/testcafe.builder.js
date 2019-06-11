"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var architect_1 = require("@angular-devkit/architect");
var core_1 = require("@angular-devkit/core");
var url = require("url");
var lodash_1 = require("lodash");
var createTestCafe = require("testcafe");
function runTestcafe(opts) {
    return __awaiter(this, void 0, void 0, function () {
        var port1, port2, proxy, proxyBypass, testCafe, runner;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    port1 = opts.ports && opts.ports[0];
                    port2 = opts.ports && opts.ports[1];
                    proxy = opts.proxy;
                    proxyBypass = opts.proxyBypass;
                    return [4 /*yield*/, createTestCafe(opts.host, port1, port2, opts.ssl, opts.dev)];
                case 1:
                    testCafe = _a.sent();
                    runner = opts.live
                        ? testCafe.createLiveModeRunner()
                        : testCafe.createRunner();
                    runner.isCli = true;
                    return [2 /*return*/, (runner
                            .useProxy(proxy, proxyBypass)
                            .src(opts.src)
                            .browsers(opts.browsers)
                            // .reporter(opts.reporters)
                            .concurrency(opts.concurrency || 1)
                            .filter(function (testName, fixtureName, fixturePath, testMeta, fixtureMeta) {
                            if (opts.test && testName !== opts.test)
                                return false;
                            if (opts.testGrep && !RegExp(opts.testGrep).test(testName))
                                return false;
                            if (opts.fixture && fixtureName !== opts.fixture)
                                return false;
                            if (opts.fixtureGrep && !RegExp(opts.fixtureGrep).test(fixtureName))
                                return false;
                            if (opts.testMeta && !lodash_1.isMatch(testMeta, opts.testMeta))
                                return false;
                            if (opts.fixtureMeta && !lodash_1.isMatch(fixtureMeta, opts.fixtureMeta))
                                return false;
                            return true;
                        })
                            .screenshots(opts.screenshotsPath || ".", opts.screenshotsOnFails, opts.screenshotsPathPattern)
                            .run(opts))];
            }
        });
    });
}
function execute(options, context) {
    return __awaiter(this, void 0, void 0, function () {
        var baseUrl, server, target, serverOptions, overrides, result, publicHost, clientUrl, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // ensure that only one of these options is used
                    if (options.devServerTarget && options.baseUrl) {
                        throw new Error(core_1.tags.stripIndents(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    The 'baseUrl' option cannot be used with 'devServerTarget'.\n    "], ["\n    The 'baseUrl' option cannot be used with 'devServerTarget'.\n    "]))));
                    }
                    if (!options.devServerTarget) return [3 /*break*/, 4];
                    target = architect_1.targetFromTargetString(options.devServerTarget);
                    return [4 /*yield*/, context.getTargetOptions(target)];
                case 1:
                    serverOptions = _a.sent();
                    overrides = {
                        watch: false
                    };
                    if (options.host !== undefined) {
                        overrides.host = options.host;
                    }
                    else if (typeof serverOptions.host === "string") {
                        options.host = serverOptions.host;
                    }
                    else {
                        options.host = overrides.host = "localhost";
                    }
                    if (options.port !== undefined) {
                        overrides.port = options.port;
                    }
                    else if (typeof serverOptions.port === "number") {
                        options.port = serverOptions.port;
                    }
                    return [4 /*yield*/, context.scheduleTarget(target, overrides)];
                case 2:
                    server = _a.sent();
                    return [4 /*yield*/, server.result];
                case 3:
                    result = _a.sent();
                    if (!result.success) {
                        return [2 /*return*/, { success: false }];
                    }
                    if (typeof serverOptions.publicHost === "string") {
                        publicHost = serverOptions.publicHost;
                        if (!/^\w+:\/\//.test(publicHost)) {
                            publicHost = (serverOptions.ssl ? "https" : "http") + "://" + publicHost;
                        }
                        clientUrl = url.parse(publicHost);
                        baseUrl = url.format(clientUrl);
                    }
                    else if (typeof result.baseUrl === "string") {
                        baseUrl = result.baseUrl;
                    }
                    else if (typeof result.port === "number") {
                        baseUrl = url.format({
                            protocol: serverOptions.ssl ? "https" : "http",
                            hostname: options.host,
                            port: result.port.toString()
                        });
                    }
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 5, 6, 9]);
                    return [2 /*return*/, runTestcafe(__assign({}, options, { baseUrl: baseUrl }))
                            .catch(function (e) {
                            process.exit(2);
                            return { error: e, success: false };
                        })
                            .then(function () {
                            return { success: true };
                        })];
                case 5:
                    e_1 = _a.sent();
                    process.exit(1);
                    return [2 /*return*/, { success: false, error: e_1 }];
                case 6:
                    if (!server) return [3 /*break*/, 8];
                    return [4 /*yield*/, server.stop()];
                case 7:
                    _a.sent();
                    _a.label = 8;
                case 8: return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    });
}
exports.default = architect_1.createBuilder(execute);
var templateObject_1;
//# sourceMappingURL=testcafe.builder.js.map