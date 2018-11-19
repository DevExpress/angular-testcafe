export interface TestcafeBuilderSchema {
  devServerTarget?: string;
  src: string;
  browsers: string;
  reporter: string;
  port?: number;
  host: string;
  baseUrl: string;
  "port": {
    "type": "number",
    "description": "The port to use to serve the application."
  },
  "host": {
    "type": "string",
    "description": "Host to listen on.",
    "default": "localhost"
  },
  "baseUrl": {
    "type": "string",
    "description": "Base URL for TestCafe to connect to."
  }
}
