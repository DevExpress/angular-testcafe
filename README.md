# angular-testcafe [![Tests - E2E](https://github.com/DevExpress/angular-testcafe/actions/workflows/test-e2e.yml/badge.svg)](https://github.com/DevExpress/angular-testcafe/actions/workflows/test-e2e.yml)
A custom Angular builder for [TestCafe](http://devexpress.github.io/testcafe/).
Serves the Angular application, and then runs the TestCafe tests.

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
