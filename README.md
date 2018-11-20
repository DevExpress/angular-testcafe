# angular-testcafe
A custom Angular builder for [TestCafe](http://devexpress.github.io/testcafe/).
Serves the Angular application, and then runs the TestCafe tests.

## Use in angular.json

```json
{
  "projects": {
    "my-project-e2e": {
      "architect": {
        "e2e": {
          "builder": "@angular-builders/build-angular:testcafe",
          "options": {
            "browsers": ["chrome", "firefox"],
            "src": "e2e/*.e2e-spec.ts",
            "reporter": "json",
            "host": "localhost:4200",
            "port": "4200"
          }
        }
      }
    }
  }
}
```
