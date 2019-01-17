# angular-testcafe [![Build Status](https://travis-ci.org/politie/angular-testcafe.svg?branch=master)](https://travis-ci.org/politie/angular-testcafe)
A custom Angular builder for [TestCafe](http://devexpress.github.io/testcafe/).
Serves the Angular application, and then runs the TestCafe tests.

## Use in angular.json
```json
{
  "projects": {
    "my-project-e2e": {
      "architect": {
        "e2e": {
          "builder": "angular-testcafe-builder:testcafe",
          "options": {
            "browsers": [
              "chrome --no-sandbox",
              "firefox"
            ],
            "src": "e2e/*.e2e-spec.ts",
            "host": "localhost",
            "port": "4200",
            "reporters": [
              {
                "name": "html",
                "outStream": "path/to/my/report.html"
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

> NOTE: `port`/`host` is for Angular to be served on. `ports` are the ports for TestCafe to run on   

## build
```bash
npm run build
```

## pack
```bash
npm pack
```

## NOT Implemented (TODO):
* remote browsers
* `--test` argument
* `--test-grep` argument
* `--test-meta` argument
* `--fixture` argument
* `--fixture-grep` argument
* `--fixture-meta` argument
* QR code
* tests
