export interface TestcafeBuilderSchema {
  src: string;
  browsers: string;
  reporter: string;
  port?: number;
  host: string;
  baseUrl: string;
}
