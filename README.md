# angular-testcafe [![Tests - E2E](https://github.com/DevExpress/angular-testcafe/actions/workflows/test-e2e.yml/badge.svg)](https://github.com/DevExpress/angular-testcafe/actions/workflows/test-e2e.yml)

A custom Angular builder for [TestCafe](http://devexpress.github.io/testcafe/).
Serves the Angular application, and then runs the TestCafe tests.

# ⚠️**angular-testcafe supersedes @politie/angular-testcafe-builder**⚠️
[@politie/angular-testcafe-builder](https://www.npmjs.com/package/@politie/angular-testcafe-builder) authors (Dutch National Police and Tim Nederhoff in person) have transferred the repository, related code, assets, and rights to DevExpress. The TestCafe team maintains and supports the package under the new name [angular-testcafe](https://www.npmjs.com/package/angular-testcafe). 

If your projects are still using [@politie/angular-testcafe-builder](https://www.npmjs.com/package/@politie/angular-testcafe-builder), we recommend that you switch to [angular-testcafe](https://www.npmjs.com/package/angular-testcafe). The development of [@politie/angular-testcafe-builder](https://www.npmjs.com/package/@politie/angular-testcafe-builder) is discontinued: it won't receive any updates, even for critical bugs and security vulnerabilities.

## Install
```bash
$ npm install --save-dev angular-testcafe
```

## Use in angular.json
```json
{
  "projects": {
    "my-project-e2e": {
      "architect": {
        "e2e": {
          "builder": "angular-testcafe",
          "options": {
            "browsers": [
              "chrome --no-sandbox",
              "firefox"
            ],
            "src": ["e2e/*.e2e-spec.ts"],
            "reporters": [
              {
                "name": "html",
                "output": "path/to/my/report.html"
              },
              {
                "name": "spec"
              }
            ]
          }
        }
      }
    }
  }
}
```
> NOTE: check [schema.json](src/testcafe/schema.json) for a list of all options

A tutorial how to use Angular and Testcafe combined with this builder can be found [here](https://medium.com/test-automation-pro/testcafe-tests-in-an-angular-project-e1d1ccc6e1cb)

## build
```bash
$ npm run build
```

## pack
```bash
$ npm pack
```

## NOT Implemented (TODO):
* remote browsers
* QR code
* video
* ssl
* clientScripts

## Contributors

Originally created at [Dutch National Police](https://www.politie.nl) by
* [Tim Nederhoff](https://github.com/timnederhoff) (main author)
* [Peter de Beijer](https://github.com/peterdebeijer)
* [Richard Kettelerij](https://github.com/rkettelerij)
* [Bjorn Schijff](https://github.com/bjeaurn)

Developer Express Inc. ([https://devexpress.com](https://devexpress.com))
