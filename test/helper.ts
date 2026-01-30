// This file contains code that we reuse between our tests.
import * as path from "node:path";
import * as test from "node:test";
import helper from "fastify-cli/helper.js";
import { globalErrorHandler } from "../src/hooks/error";
import { globalOnSendHandler } from "../src/hooks/onSend";
import { FastifyError } from "fastify";

export type TestContext = {
  after: typeof test.after;
};

const AppPath = path.join(__dirname, "..", "src", "app.ts");

// Fill in this config with all the configurations
// needed for testing the application
function config() {
  return {
    skipOverride: true, // Register our application with fastify-plugin
  };
}

// Automatically build and tear down our instance
async function build(t: TestContext) {
  // you can set all the options supported by the fastify CLI command
  const argv = [AppPath];

  // fastify-plugin ensures that all decorators
  // are exposed for testing purposes, this is
  // different from the production setup
  const app = await helper.build(argv, config());
  app.addHook(globalOnSendHandler);
  app.setErrorHandler(globalErrorHandler);

  // Tear down our app after we are done
  t.after(() => app.close());

  return app;
}

/**
 * Wrap a successful operation in the same JSON format
 * as the globalOnSendHandler.
 */
function wrapSuccessfulOperationJSON<T>(data: T) {
  return {
    status: "SUCCESS" as const,
    data,
  };
}

/**
 * Wrap a failed operation in the same JSON format
 * as the globalErrorHandler.
 */
function wrapFailedOperationJSON(error: FastifyError) {
  return {
    status: "FAIL" as const,
    data: null,
    error,
  };
}

export { config, build, wrapSuccessfulOperationJSON, wrapFailedOperationJSON };
