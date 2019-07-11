# Changelog

## v2.0.2 (2019-7-11)
added testcafe 1.3.1 features:
* added tsConfigPath entry in the schema

## v2.0.1 (2019-06-12)
Bugfixes:
* console error for testcafe runner failures
* fixed reporters

## v2.0.0 (2019-6-11)
compatible with Angular 8

## v1.0.7 (2019-2-11)
compatible with testcafe 1.0.0 (use `reporter: [{ name: '', output: '' }]` )

## v1.0.6 (2019-2-4)
New parameters in the schema:
* test: string
* testGrep: RegExp string
* testMeta: object
* fixture: string
* fixtureGrep: RegExp string
* fixtureMeta: object

## v1.0.5 (2019-1-7)
updated according to v1.0.0-alpha.1 of Testcafe

## v.1.0.4 (2019-1-7)
exit code 1 if runner failed
